class TableView {
  constructor(data, headers=[]){
    this.data = data;
    this.headers = headers;
    if(this.headers.length == 0){
      this.headers = Object.keys(this.data[0])
    } else { 
      this.headers = headers
    }

    this.table = document.createElement('table');
    this.table.appendChild(this.buildThead());
    this.table.appendChild(this.buildTbody());
  }

  buildThead(){
    var 
      thead = document.createElement('thead'),
      tr = document.createElement('tr');
    
    this.headers.forEach(header => {
      var th = document.createElement('th');
      th.textContent = header;
      tr.appendChild(th);
    })
    
    thead.appendChild(tr);
    
    return thead;
  }

  buildTbody(){
    var tbody = document.createElement('tbody');
    
    this.data.forEach(item => {
      var tr = document.createElement('tr');
      Object.keys(item).forEach(key => { 
        var td = document.createElement('td'); 
        td.textContent = item[key];
        tr.appendChild(td);
      })
      tbody.appendChild(tr);
    })
    return tbody;
  }

  render(){
    return this.table
  }
}
