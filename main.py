import flask
from flask.globals import request
from flask import render_template,redirect
from werkzeug.utils import secure_filename
from postgres_conn import csv_to_db,fetch_stored_data,fetch_column_names,aggregate_funcs,fetch_columns_data
import json

app = flask.Flask(__name__)




@app.route('/upload/dataset')
def upload_dataset():
   return render_template('Upload.html')


@app.route('/')
def homepage():
   return render_template('index.html')

@app.route('/dataset',methods=['GET','POST'])
def dataset_upload():
    if flask.request.method == 'POST':
        file = request.files['file']
        fname = request.form['dataName']
        csv_to_db(file,secure_filename(fname))
        return redirect('/upload/dataset')
    if flask.request.method == 'GET':
        return json.dumps(fetch_stored_data())


@app.route('/computations')
def computations ():
    return render_template('computations.html')


@app.route('/fetchColumns/<dataset_name>',methods=['GET'])
def fetch_columns(dataset_name):
    return json.dumps(fetch_column_names(dataset_name))


@app.route('/dataset/<data_id>/compute',methods=['POST'])
def compute(data_id):
    data = request.json
    res = aggregate_funcs(data['operation'],data['columnName'],data_id)
    return {"res":str(res[0])}


@app.route('/dataset/<dataid>/plot',methods=['GET'])
def plot(dataid):
    req_data = request.args
    data = fetch_columns_data(req_data.get('column1'),req_data.get('column2'),dataid)
    return data



app.run(debug=True)