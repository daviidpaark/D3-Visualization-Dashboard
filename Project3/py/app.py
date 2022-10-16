from flask import Flask
import pandas as pd

app = Flask(__name__)


@app.route('/')
def analyze():  # put application's code here
    df = pd.read_csv('data/cameras.csv')
    return df.corr().to_csv()


if __name__ == '__main__':
    app.run()

