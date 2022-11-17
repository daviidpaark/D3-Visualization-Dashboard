from flask import Flask
from flask_cors import CORS
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.manifold import MDS
from sklearn.metrics.pairwise import euclidean_distances

df = pd.read_csv('data/cameras.csv')
mdsData = None


def calculateMDS():
    features = ['Max_resolution', 'Low_resolution', 'Effective_pixels', 'Zoom_wide', 'Zoom_tele', 'Normal_focus_range',
                'Macro_focus_range', 'Storage', 'Weight', 'Price']
    x = df.loc[:, features].values
    mds = MDS(random_state=0)
    distance = euclidean_distances(x)
    mds = MDS(dissimilarity='precomputed', random_state=0)
    x_transform_L1 = mds.fit_transform(distance)
    principalDf = pd.DataFrame(data=x_transform_L1, columns=['x', 'y'])
    global mdsData
    mdsData = pd.concat([principalDf, df[['Model']]], axis=1)


calculateMDS()
app = Flask(__name__)
CORS(app)


@app.route('/data')
def data():
    return df.to_csv()


@app.route('/biplot')
def biplot():
    features = ['Max_resolution', 'Low_resolution', 'Effective_pixels', 'Zoom_wide', 'Zoom_tele', 'Normal_focus_range',
                'Macro_focus_range', 'Storage', 'Weight', 'Price']
    x = df.loc[:, features].values
    y = df.loc[:, ['Model']].values
    x = StandardScaler().fit_transform(x)

    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(x)
    principalDf = pd.DataFrame(data=pca.components_, columns=features)
    return principalDf.to_csv()


@app.route('/pca')
def pca():
    features = ['Max_resolution', 'Low_resolution', 'Effective_pixels', 'Zoom_wide', 'Zoom_tele', 'Normal_focus_range',
                'Macro_focus_range', 'Storage', 'Weight', 'Price']
    x = df.loc[:, features].values
    y = df.loc[:, ['Model']].values
    x = StandardScaler().fit_transform(x)

    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(x)
    principalDf = pd.DataFrame(data=principalComponents, columns=['PC1', 'PC2'])
    finalDf = pd.concat([principalDf, df[['Model']]], axis=1)
    return finalDf.to_csv()


@app.route('/mds')
def mds():
    return mdsData.to_csv()


if __name__ == '__main__':
    app.run()
