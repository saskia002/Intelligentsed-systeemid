from collections import Counter
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

#scikit-learn pkg

def most_common_words(texts):
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(texts)
    word_freq = Counter(vectorizer.get_feature_names_out())
    return word_freq.most_common(5)

def predict_text_type(text, ad_words, math_words):
    ad_count = sum(text.count(word) for word, _ in ad_words)
    math_count = sum(text.count(word) for word, _ in math_words)
    return "Reklaam" if ad_count > math_count else "Matemaatika"

ad_texts = [
    "Suured allahindlused kõikidele toodetele! Osta kohe ja säästa.",
    "Unikaalsed pakkumised ainult sinule. Ära maga maha!",
    "Parimad hinnad, kvaliteetsed tooted. Külasta meie e-poodi nüüd.",
]

math_texts = [
    "Algebra on matemaatika haru, mis tegeleb arvude ja tundmatute suhetega.",
    "Diferentsiaalvõrrandid on oluline osa matemaatika uurimisest.",
    "Geomeetria keskendub kujude ja nende omaduste uurimisele.",
    "Alegbra"
]

# Levinumad sõnad
ad_common_words = most_common_words(ad_texts)
math_common_words = most_common_words(math_texts)

print("Reklaami levinumad sõnad:", ad_common_words)
print("Matemaatika levinumad sõnad:", math_common_words)

# Uued tekstid
new_ad_text = "Superpakkumine! Osta kaks, saa üks tasuta. Ainult täna!"
new_math_text = "Diferentsiaalvõrrandid on matemaatikas olulised võrrandid."

# Määra tüüpideks
prediction_ad = predict_text_type(new_ad_text, ad_common_words, math_common_words)
prediction_math = predict_text_type(new_math_text, ad_common_words, math_common_words)

print("Uue reklaamiteksti tüüp:", prediction_ad)
print("Uue matemaatikateksti tüüp:", prediction_math)

# Luuletused
poems = [
    "Liginev pikne. Kõrvetab päike. Raske ja palav on õhk lõhnade magususes. Tundub kui rõhk helgetavas vagususes. Haudub äike. Pilvi tumesiniseid lõunapool pikkamisi üles ajab. Kõue kauge hääl kumedalt kusagil kajab. Tulevirav nool Kabelipalu pääl välgatab. Pimedaks tõmbavat kaugusi säraseid näen ju sinetava pilve varju all. Kõmin kui sõjahobuse tammumine üleval. On nagu asju salapäraseid teatataks pikse ligineval mürinal. Helgetav päike end pilvesse peidab. Ikka eredamalt välku heidab. Kärgatuste kurjakuulutav järskus aknaruutusid täristab. Põua pika, lämmatava ummuse käristab, latvasid längutab, lehtesid väristab tuulispääna tulevate puhangute värskus.",
    "Kui ma ükskord suureks saan siis kui kasvan vanaks on mul üsna kindel plaan hakkan näärivanaks"
]

# Treenime mudeli
all_texts = ad_texts + math_texts + poems
labels = ["Reklaam"] * len(ad_texts) + ["Matemaatika"] * len(math_texts) + ["Luuletus"] * len(poems)

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(all_texts)

X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

# Mudeli treenimine
model = MultinomialNB()
model.fit(X_train, y_train)

# Mudeli hindamine
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Mudeli täpsus:", accuracy)

# Uus tekst
new_text = "veidi harjutama pean kuidas anda kinki kapi otsas küll ma tean on meil vitsakimpki"

# Ennustamine
new_text_vectorized = vectorizer.transform([new_text])
prediction = model.predict(new_text_vectorized)

print("Ennustus tekstile:", prediction[0])
