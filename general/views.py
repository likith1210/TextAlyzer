from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import string
import math


# Create your views here.

def index(request):
    return render(request, "general/index.html")

@csrf_exempt
def summary(request):
    if request.method == 'POST':
        n = 0.0
        res = {}
        res['sum'] = False
        data = request.POST.get("data", None)
        l = request.POST.get("len", None)
        if l=='short':
            n = 1.8
        elif l=='long':
            n = 1.2
        else:
            n = 1.5

        stopWords = set(stopwords.words("english"))
        words = word_tokenize(data)

        freqTable = dict()
        for word in words:
            word = word.lower()
            if word in stopWords:
                continue
            if word in freqTable:
                freqTable[word] += 1
            else:
                freqTable[word] = 1

        sentences = sent_tokenize(data)
        sentenceValue = dict()
        for sentence in sentences:
            for word, freq in freqTable.items():
                if word in sentence.lower():
                    if sentence in sentenceValue:
                        sentenceValue[sentence] += freq
                    else:
                        sentenceValue[sentence] = freq

        sumValues = 0
        for sentence in sentenceValue:
            sumValues += sentenceValue[sentence]

        average = int(sumValues / len(sentenceValue))

        summary = ''
        for sentence in sentences:
            if (sentence in sentenceValue) and (sentenceValue[sentence] > (n* average)):
                summary += " " + sentence
        res['sum'] = summary

        return JsonResponse(res)

    return render(request, "general/summary.html")

@csrf_exempt
def answer(request):
    if request.method == 'POST':
        res = {}
        res['ans'] = False
        data = request.POST.get("data", None)
        ques = request.POST.get("ques", None)

        query = set(tokenize(ques))

        sentences = dict()
        for passage in data.split('\n'):
            for sentence in nltk.sent_tokenize(passage):
                tokens = tokenize(sentence)
                if tokens:
                    sentences[sentence] = tokens

        idfs = compute_idfs(sentences)

        matches = top_sentences(query, sentences, idfs, 1)
        res['ans'] = matches[0]
        return JsonResponse(res)

    return render(request, "general/answer.html")

def tokenize(sentence):
    words = []
    tokenized = nltk.word_tokenize(sentence.lower())

    for word in tokenized:
        if word not in string.punctuation and word not in nltk.corpus.stopwords.words("english"):
            words.append(word)

    return words

def compute_idfs(sentences):

    sen_len = len(sentences)
    idf = dict()
    unique_words = set(sum(sentences.values(), []))
    for word in unique_words:
        count = 0
        for sent in sentences.values():
            if word in sent:
                count += 1
        idf[word] = math.log(sen_len/count)

    return idf

def top_sentences(query, sentences, idfs, n):
    total_idf = dict()

    for sen,words in sentences.items():
        t_idf = 0
        for word in query:
            if word in words:
                t_idf += idfs[word] 
        if t_idf != 0:
            density = sum([words.count(x) for x in query]) / len(words)
            total_idf[sen] = (t_idf, density)

    rank = [k for k, v in sorted(total_idf.items(), key = lambda x: (x[1][0], x[1][1]), reverse = True)]
    return rank[:n]