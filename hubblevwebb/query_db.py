from db_setup import Observation, engine
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
session = Session()

observations = session.query(Observation).all()

for obs in observations:
    print(f"{obs.object_name} | {obs.telescope} | {obs.obs_date} | {obs.image_url}")
