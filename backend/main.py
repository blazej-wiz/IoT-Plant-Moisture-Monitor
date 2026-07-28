from fastapi import FastAPI, Depends
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel


app = FastAPI()


load_dotenv()
database_url = os.getenv("DATABASE_URL")

# so this establishes the connection to the supabase database
engine = create_engine(database_url)
# this session is just creating a instance we can call upon when we want to modify or update
# the database
SessionLocal = sessionmaker(bind=engine)

#this just makes sure everything inhereted from base is a database table
Base = declarative_base()

# this recreates the database thats in supabase so i can write to it via backend
class ESP(Base):
    __tablename__ = 'esp'

    id = Column(Integer, primary_key=True, index=True)
    deviceid = Column(String, index=True)
    name = Column(String, unique=True, index=True)
    model = Column(String, index=True)


def get_db():
    # this allows a new session to be created and closed each time a function
    # wants to modify the database at a endpoint as it links it to the database of supabase
    db = SessionLocal()
    try:
        #allows fastAPI to use db in endpoints
        yield db
    finally:
        db.close()

#this basically is like a type in typescript, it just ensures that when something calls
# an endpoint and wants to modify a database it checks at runtime whether the data
# being passed in is the correct data type and raises an error if its not
class espCreate(BaseModel):
    deviceid: str
    name: str
    model: str


@app.post("/api/devices")
# so this defines the incoming data to the endpoint as esp_data and it checks using the
#espcreate class if the data matches the types it should and then it links the database
# commands to the actual session that is connected to supabase database
def create_esp(esp_data: espCreate, db: Session = Depends(get_db)):
    # then this fills in the ESP data table defined earlier with adequate data
    # then adds that new data to the database and commits it which sends it over to 
    #supabase
    new_esp = ESP(deviceid=esp_data.deviceid, 
                 name=esp_data.name, 
                 model=esp_data.model)
    db.add(new_esp)
    db.commit()

