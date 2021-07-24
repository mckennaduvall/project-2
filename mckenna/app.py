from flask import Flask,jsonify,render_template,Response
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import MetaData, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.sql import select
from sqlalchemy import func
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

Base = automap_base()

@app.route('/')
def hello():
	return "OUR DATABASE"

@app.route('/getdata')
def getdatafrompg():
	engine = create_engine('postgresql://postgres:postgres@localhost/project_2')

	Base.prepare(engine, reflect=True)

	drought = Base.classes.drought_severity

	session = Session(engine)

	result = session.query(drought)

	data = []

	data_dict = {}

	for row in result:

		counter = 1

		if row.state[i] = [row.state[i + 1]]:

			





		data.append(row.state)


		data_dict[row.date] = row.dsci

		res = {idx: {key : data_dict[key]} for idx, key in zip(data, data_dict)}



	json = jsonify(data)

	return json 

if __name__ == '__main__':
    app.run()
