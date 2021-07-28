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
import pickle

app = Flask(__name__)

CORS(app)

Base = automap_base()
engine = create_engine('postgresql://postgres:postgres@localhost/project_2')


	

	

@app.route('/')
def hello():
	return "OUR DATABASE"



@app.route('/getdata')
def getdatafrompg():
	
	session = Session(engine)

	Base.prepare(engine, reflect=True)

	Drought = Base.classes.drought_severity

	

	result = session.query(Drought).all()


	data_dict = {}

	for row in result:

		if row.state not in data_dict:

			data_dict[row.state] = {"date": [], "dsci": []}

		data_dict[row.state]["date"].append(row.date)

		data_dict[row.state]["dsci"].append(row.dsci)
		

	json = jsonify(data_dict)

	print(data_dict)

	session.close()
	return json 


#California Counties in drought since 2015 API: Andrew
@app.route('/getCountyData')
def getcountydata():
	
	session = Session(engine)
	Base.prepare(engine, reflect=True)

	#ca_drought = Base.classes.ca_drought

	# test = session.execute("SELECT index, fips, start_date, end_date, consecutiveweeks, state, county FROM ca_drought WHERE end_date = '2021-07-01' ORDER BY county;").fetchall()
	#test = session.execute("SELECT cdrt.index, cdrt.fips, cdrt.start_date, cdrt.end_date, cdrt.consecutiveweeks, cdrt.state, cdrt.county, ccrd.coordinates FROM ca_drought cdrt JOIN ca_coord ccrd ON cdrt.county=ccrd.county WHERE cdrt.end_date = '2021-07-01' ORDER BY cdrt.county;").fetchall()
	test = session.execute("SELECT cdrt.index, cdrt.fips, cdrt.start_date, cdrt.end_date, cdrt.consecutiveweeks, cdrt.state, cdrt.county, ccrd.coordinates FROM ca_drought cdrt JOIN ca_coord ccrd ON cdrt.county=ccrd.county WHERE cdrt.end_date = '2021-07-01' AND cdrt.county != 'Los Angeles County' ORDER BY cdrt.county;").fetchall()

	

	#print(test)

	county_dict = []

	for i in test:
		if i.county not in county_dict:
			county_dict.append(
				{
					"type": "Feature",
					"properties": {
						"county":i.county,
						"state": i.state, 
						"startDate":i.start_date, 
						"endDate":i.end_date, 
						"consecutiveWeeks":int(i.consecutiveweeks),
						"fips":i.fips 
					},
					"geometry": {
						"type": "Polygon",
						"coordinates":eval(i.coordinates)
					}
				}
			)



	json = jsonify(county_dict)
	print(county_dict)

	session.close()

	return json 

if __name__ == '__main__':
    app.run()
