from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import sqlite3
import os

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
db_path = "database.db"
def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        full_name TEXT
    )""")
    # Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        color TEXT
    )""")
    # Orders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'Pending',
        FOREIGN KEY (user_id) REFERENCES users(id)
    )""")
    conn.commit()
    conn.close()

# Initialize DB on startup
if not os.path.exists(db_path):
    init_db()

# Models
class User(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class Product(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    color: Optional[str] = None

class Order(BaseModel):
    user_id: int
    total: float

# Security and Authentication
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/register")
def register(user: User):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    hashed_password = get_password_hash(user.password)
    try:
        cursor.execute("INSERT INTO users (username, email, hashed_password, full_name) VALUES (?, ?, ?, ?)",
                       (user.username, user.email, hashed_password, user.full_name))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Username or email already exists")
    conn.close()
    return {"message": "User registered successfully"}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, hashed_password FROM users WHERE username = ?", (form_data.username,))
    user = cursor.fetchone()
    conn.close()
    if not user or not verify_password(form_data.password, user[2]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user[1]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/products", response_model=List[Product])
def get_products():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name, description, price, color FROM products")
    rows = cursor.fetchall()
    conn.close()
    return [Product(name=row[0], description=row[1], price=row[2], color=row[3]) for row in rows]

@app.post("/products")
def add_product(product: Product):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO products (name, description, price, color) VALUES (?, ?, ?, ?)",
                   (product.name, product.description, product.price, product.color))
    conn.commit()
    conn.close()
    return {"message": "Product added successfully"}

@app.post("/orders")
def create_order(order: Order):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO orders (user_id, total) VALUES (?, ?)", (order.user_id, order.total))
    conn.commit()
    conn.close()
    return {"message": "Order created successfully"}

@app.get("/orders")
def get_orders():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders")
    rows = cursor.fetchall()
    conn.close()
    return rows
