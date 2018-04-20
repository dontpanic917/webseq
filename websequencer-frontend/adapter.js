class Adapter{
  static createSequence(){
    fetch(`http://localhost:3000/sequences`,{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({task:{description:`${description}`,priority:`${priority}`}})
  })
  }
  static readSequence(){
    fetch("http://localhost:3000/sequences").then(resp => resp.json()).then()
  }

  static updateSequence(id){
    url = `http://localhost:3000/sequences/${id}`
    fetch(url,{
    method:"PATCH",
    headers:{'Content-Type':'application/json','Accepts':'application/json'},
    body:JSON.stringify({sequence:{completed:true}})
  })
  }

  static deleteSequence(id){
    url = `http://localhost:3000/sequences/${id}`
    fetch(url,{method:"DELETE",})
  }
}
