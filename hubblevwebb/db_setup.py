from sqlalchemy import create_engine, Column, String, Float, Date, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Observation(Base):
    __tablename__ = 'observations'
    id = Column(Integer, primary_key=True)
    object_name = Column(String)
    telescope = Column(String)
    obs_id = Column(String)
    ra = Column(Float)
    dec = Column(Float)
    obs_date = Column(Date)
    filters = Column(String)
    image_url = Column(String)

# Create the SQLite database
engine = create_engine("sqlite:///astro_data.db")
Base.metadata.create_all(engine)
