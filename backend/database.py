from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

# You might need other tables for authentication features like:
# - Tokens for sessions or password resets
# - Roles for authorization

# Example for a simple token table (optional)
# class Token(Base):
#     __tablename__ = 'tokens'
#
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey('users.id'))
#     token = Column(String, unique=True, index=True)
#     created_at = Column(DateTime)
#     expires_at = Column(DateTime)
#
#     user = relationship("User")

# Replace with your actual database connection string
# SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# To create the tables in the database (call this once):
# Base.metadata.create_all(bind=engine)