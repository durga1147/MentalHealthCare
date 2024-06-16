import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn import tree
import pickle
data = pd.read_csv('deepression.csv')
data.drop(columns=['Number'], inplace=True)


data['Depression State'].replace(to_replace={'No depression': 1, 'Mild': 2, 'Moderate': 3, 'Severe':4}, inplace=True)
X = data.drop('Depression State', axis=1) 
y = data['Depression State']  

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#creating the classifier
model = tree.DecisionTreeClassifier()

#fitting the model 
model.fit(X_train,y_train)

#makeing the pickel file of the model
pickle.dump(model, open("model.pkl","wb"))
print("Done")



