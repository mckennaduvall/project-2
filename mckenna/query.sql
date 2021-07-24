DROP TABLE drought_severity;

CREATE TABLE drought_severity (
	index INT PRIMARY KEY,
	state VARCHAR(30),
	date INT,
	DSCI INT
);

SELECT * FROM drought_severity;