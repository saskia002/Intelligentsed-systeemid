import pandas as pd
from collections import Counter
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

def most_common_words(texts):
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(texts)
    word_freq = Counter(vectorizer.get_feature_names_out())
    return word_freq.most_common(5)

def predict_text_type(text, ad_words, math_words):
    ad_count = sum(text.count(word) for word, _ in ad_words)
    math_count = sum(text.count(word) for word, _ in math_words)
    return "Reklaam" if ad_count > math_count else "Matemaatika"

# Read data from CSV
df = pd.read_csv('data.csv')
texts = df['text'].tolist()
labels = df['label'].tolist()

# Levinumad sõnad
ad_texts = [text for text, label in zip(texts, labels) if label == 'Reklaam']
math_texts = [text for text, label in zip(texts, labels) if label == 'Matemaatika']

ad_common_words = most_common_words(ad_texts)
math_common_words = most_common_words(math_texts)

print("Reklaami levinumad sõnad:", ad_common_words)
print("Matemaatika levinumad sõnad:", math_common_words)

# Treenime mudeli
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

# Mudeli treenimine
model = MultinomialNB()
model.fit(X_train, y_train)

# Mudeli hindamine
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Mudeli täpsus:", accuracy)

# Uus tekst
new_text = "Kevadtuuled õrnalt paitavad, lilled avanevad päikese säras."

# Ennustamine
new_text_vectorized = vectorizer.transform([new_text])
prediction = model.predict(new_text_vectorized)

print("Ennustus tekstile:", prediction[0])
