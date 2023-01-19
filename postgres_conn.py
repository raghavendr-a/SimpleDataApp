import pandas as pd
from sqlalchemy import create_engine,MetaData,Table
from sqlalchemy_utils import database_exists, create_database


db = "SimpleDataApp"
pswd = '220123'
host='127.0.0.1'
port='5555'
user = 'postgres'

URI = f"""postgresql://{user}:{pswd}@{host}:{port}/{db}"""
engine = create_engine(URI)

if not database_exists(engine.url):
    create_database(engine.url)
    print("DataBase created")


md = MetaData()

def csv_to_db(fileobj,tableName):
    try:
        df = pd.read_csv(fileobj,sep=',')
        df.to_sql(tableName,engine)
        del df
    except:
        return "cannot insert data"

def fetch_stored_data():
    return engine.table_names()


def fetch_column_names(table_Name):
    table = Table(table_Name, md, autoload=True, autoload_with=engine)
    column_names = []
    for c in table.c:
       column_names.append(c.name)
    return column_names
            

def fetch_columns_data(column1,column2,table_Name):
    conn = engine.connect()
    columns_data = conn.execute(f"""SELECT "{column1}" ,"{column2}" from "{table_Name}" """)
    x_axis = []
    y_axis = []
    for i in columns_data.fetchmany(30):
        x_axis.append(i[0])
        y_axis.append(i[1])
    conn.close()
    return {'x_axis':x_axis,'y_axis':y_axis} 


def aggregate_funcs(ops,column_name,db_name): 
    conn = engine.connect()
    if ops == 'MIN':
        res = conn.execute(f"""SELECT min("{column_name}") from "{db_name}" """)
    elif ops == 'MAX':
        res = conn.execute(f"""SELECT max("{column_name}") from "{db_name}" """)
    elif ops == 'SUM':
        res = conn.execute(f"""SELECT sum("{column_name}") from "{db_name}" """)
    conn.close()
    return res.fetchone()