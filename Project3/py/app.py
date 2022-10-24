from flask import Flask
import pandas as pd

app = Flask(__name__)

df = pd.read_csv('data/cameras.csv')


@app.route('/data')
def data():
    return df.to_csv()


@app.route('/corr')
def correlation():
    return df.corr().to_csv()


if __name__ == '__main__':
    app.run()
