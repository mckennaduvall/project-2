DROP TABLE drought_severity;

CREATE TABLE drought_severity (
	index INT PRIMARY KEY,start
	state VARCHAR(30),
	date INT,
	DSCI INT
);

select * from drought_severity;


/* CA County Drought */
DROP TABLE ca_drought;

CREATE TABLE ca_drought(
	index int PRIMARY KEY,
	fips int,
	start_date date,
	end_date date,
	consecutiveweeks int,
	state text,
	county text,
	FOREIGN KEY (county) REFERENCES ca_coord(county)
);

select * from ca_drought

/* Get rows associated with the max start_date for each county*/

DROP TABLE ca_coord;

CREATE TABLE ca_coord(
	state_id int,
	coordinates varchar,
	county varchar(30) PRIMARY KEY
);

select * from ca_coord;

select cdrt.index, cdrt.fips, cdrt.start_date, cdrt.end_date, cdrt.consecutiveweeks, cdrt.state, cdrt.county, ccrd.coordinates  
from ca_drought cdrt
join ca_coord ccrd
	on cdrt.county=ccrd.county
where cdrt.end_date = '2021-07-01' AND cdrt.county != 'Los Angeles County' 
order by cdrt.county;



