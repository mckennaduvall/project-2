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

	Drought = Base.classes.drought_severity

	session = Session(engine)

	result = session.query(Drought).all()


	data_dict = {}

	for row in result:

		if row.state not in data_dict:

			data_dict[row.state] = {"date": [], "dsci": []}
			
		data_dict[row.state]["date"].append(str(row.date)[:4]+"-"+str(row.date)[4:6]+"-"+str(row.date)[6:])

		data_dict[row.state]["dsci"].append(row.dsci)
		

	json = jsonify(data_dict)

	print(data_dict)


	return json 

if __name__ == '__main__':
    app.run()
