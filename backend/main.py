from fastapi import FastAPI, Depends
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime, timezone


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


class MoistureReading(Base):
    __tablename__ = 'moisture_readings'

    readingid = Column(Integer, primary_key=True, index=True)
    espid = Column(Integer, ForeignKey("esp.id"), index = True)
    percentage = Column(Integer, index=True)
    created = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    raw_average = Column(Integer, index=True)
    

class Plants(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    species = Column(String, index=True)
    watering_category = Column(String, index=True)
    watering_threshold = Column(Integer, index=True)
    alert_clear_threshold = Column(Integer, index=True)
    espid = Column(Integer, ForeignKey("esp.id"), index=True)


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


class ReadingCreate(BaseModel):
    percentage: int
    deviceid: str
    raw_average: int

class DeviceLink(BaseModel):
    deviceid: str




@app.post("/api/devices")
# so this defines the incoming data to the endpoint as esp_data and it checks using the
#espcreate class if the data matches the types it should and then it links the database
# commands to the actual session that is connected to supabase database
def create_esp(esp_data: espCreate, db: Session = Depends(get_db)):

    existing_sensor = db.query(ESP).filter(ESP.deviceid == esp_data.deviceid).first()

    if existing_sensor:
        return f"ESP {esp_data.deviceid} already exists: {existing_sensor}."

    # then this fills in the ESP data table defined earlier with adequate data
    # then adds that new data to the database and commits it which sends it over to 
    #supabase
    new_esp = ESP(deviceid=esp_data.deviceid, 
                 name=esp_data.name, 
                 model=esp_data.model)
    db.add(new_esp)
    db.commit()


@app.post("/api/readings")
#so this also actually opens the door then for incorporating multiple different databases into one project
# where i could open up a session linked to another engine and get that specific db
def create_reading(reading_data: ReadingCreate, db: Session = Depends(get_db)):

    espid = db.query(ESP).filter(ESP.deviceid == reading_data.deviceid).first()


    new_reading = MoistureReading(
        percentage=reading_data.percentage,
        espid = espid.id,
        raw_average = reading_data.raw_average,
    )
    db.add(new_reading)
    db.commit()


@app.get("/api/plants")
def get_plants(db : Session = Depends(get_db)):

    plants = db.query(Plants).all()

    return plants

@app.post("/api/readings")
#so this also actually opens the door then for incorporating multiple different databases into one project
# where i could open up a session linked to another engine and get that specific db
def create_reading(reading_data: ReadingCreate, db: Session = Depends(get_db)):

    espid = db.query(ESP).filter(ESP.deviceid == reading_data.deviceid).first()


    new_reading = MoistureReading(
        percentage=reading_data.percentage,
        espid = espid.id,
        raw_average = reading_data.raw_average,
    )
    db.add(new_reading)
    db.commit()


@app.put("/api/plants/{plant_id}/sensor")
def connect_to_sensor(plant_id: int, device_data: DeviceLink, db: Session = Depends(get_db)):

    esp = db.query(ESP).filter(ESP.deviceid == device_data.deviceid).first()

    plant = db.query(Plants).filter(Plants.plant.id == plant_id).first()

    device_link = plant(
        espid = esp.id
    )

    db.add(device_link)
    db.commit()

    return {
        "message": "Plant linked to sensor"
    }
