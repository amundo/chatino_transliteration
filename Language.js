
class Language {
  constructor(data={}){
    this.metadata = data.metadata;

    this.alphabet = data.alphabet || [];
    this.inventory = data.inventory || [];
    this.punctuation = data.punctuation || '!.?,:'.split('');
  }

  static isLanguage(language){
    return 'alphabet'  in language && Array.isArray(language.alphabet)  &&
           'inventory' in language && Array.isArray(language.inventory)
  }

  escape(unescaped){ // do we really need this?
    if(typeof unescaped != 'string'){ 
      throw new TypeError(`alphabet in definition not a string: ${unescaped}`) 
    }

    return unescaped.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  }

  get orthographyPairs() {
    let list = this.orthographies;
    if (list.length < 2) { return []; }
    let [first, ...others] = list,
        pairs = others.map(x => [first, other]);
    return pairs.concat(this.orthographies(others));
  }

  get orthographies(){
    return Object.keys(this.alphabet[0])
  }

  phonemize(text, orthography='ipa'){
    var phonemes = this.alphabet.map(phoneme => phoneme[orthography]);
    phonemes.sort((a,b) => (a.length < b.length) ? 1 : -1);

    phonemes = phonemes.map(phoneme => this.escape(phoneme));

    var pattern = `(${phonemes.join('|')})`;
    var splitter = new RegExp(pattern, 'g');
  
    return text.split(splitter).filter(x => x); 
  }

  transliterate(from, to, text){
    var substitutions = {};

    this.alphabet.forEach(letter => {
      substitutions[letter[from]] = letter[to];
    })
  
    var phonemeList = this.phonemize(text, from);

    return phonemeList.map(phoneme => {
      return substitutions[phoneme] ? substitutions[phoneme] : phoneme;
    }).join('');
  }

  depunctuate(text, punctuation=this.punctuation){
    if(text){
      var re = new RegExp(`[${punctuation}]`, 'g');
      return text.replace(re, ' ');
    } else {
      return
    }
  }

  tokenize(text){
    text = this.depunctuate(text);
    return text 
      .toLowerCase()
      .trim()
      .replace(/[ \.\?,\!]+/g, ' ') 
      .split(/[ ]+/g)
      .filter(token => token)
  }

  load(file){
    fetch(file)
      .then(response => response.json())
      .then(json => { 
         var 
           data = { alphabet: json.alphabet },
           metadata = json.metadata;
         this.initialize(data, metadata);
      })
      .catch(e => console.log(e))
  }

}
