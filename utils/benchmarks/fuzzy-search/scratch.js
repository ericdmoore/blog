var elasticlunr = require('elasticlunr');

var index = elasticlunr(function () {
    this.setRef('id');
    this.addField('title')
    this.addField('body')
    this.saveDocument(false);
});

var doc1 = {
    "id": 1,
    "title": "Oracle released its latest database Oracle 12g",
    "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
}

var doc2 = {
    "id": 2,
    "title": "Oracle released its profit report of 2015",
    "body": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion."
}

index.addDoc(doc1);
index.addDoc(doc2);

console.log({q: index.search("A Yetti is a great way to cool your drinks",{expand: true})});
console.log(JSON.stringify(index));