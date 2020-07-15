var btn = document.querySelector('.btn');
var file = document.querySelector('.file')
var fileName = document.querySelector('.fileName')
const reader=new FileReader()
btn.addEventListener('click',(e)=>{
    file.click();
})
file.addEventListener('change',(e)=>{
    var uploadedFile = e.target.files[0];
    if(uploadedFile.type !=='application/vnd.ms-excel') {
        alert("Please choose csv file");
        return;
    }
    fileName.textContent = uploadedFile.name;
    reader.onloadend = function(evt) {
        //store data in variable
        let formatedData = []
        let data  = evt.target.result;
        let groups = []
        let group = [];
        let current = 0;
        let currentReverse = 1;
        data = data.split('\n');
        data.splice(0,1);
        data.forEach(element => {
            const tmpEl = element.split(',');
            const el = {
                id:parseInt(tmpEl[0]),
                capacity:parseInt(tmpEl[1])
            }
            formatedData.push(el)
        });
        formatedData.sort((a,b)=>{
            return a.capacity - b.capacity;
        })

        //group data in 20 groups with each 15 elements
        for(let i = 0; i < 160 ; i++){

            if(current < 8) {

                group.push(formatedData[i])
                
                if(current < 7) {

                    group.push(formatedData[formatedData.length - currentReverse ]);
                    currentReverse++;

                }

                if(current ==7) {
                    groups.push(group);
                    group = []
                    current = 0;
                } else {
                    current++
                }
            }
        }
        // display data to UI
        console.log(groups);
        groups.forEach((group,index)=>{
            createGroupUI(group,index)
        })
      };
    reader.readAsText(uploadedFile)
})

function createGroupUI(group,index){
   let groupMarkup = rowMarkup(createCell,group);
   let specs = getSpecs(group,index)
   let markUp = `<div class="row"> 
                   <div class="header">
                    <div class="group-number">
                        <span class="number">Group:${specs.index}</span>
                        <span class="total">TotalCapacity:${specs.sum}mA</span>
                    </div>
                    </div>
                    ${groupMarkup}
                </div>`
    document.querySelector('.container').insertAdjacentHTML('beforeend',markUp)
    
}
function createCell(cell) {
    return `<div class="group">
                <div class="capacity">
                    Capacity:${cell.capacity}
                </div>
                <div class="id">
                    ID:${cell.id}
                </div>
            </div>`
}
function rowMarkup(createCell,group) {
    let markUp = ''
    group.forEach(cell=>{
        markUp += createCell(cell)
    })
    return markUp;
}
function getSpecs(group,index){
    let sum = 0;
    group.forEach((el)=>{
        sum += el.capacity;
    })
    return {
        sum,
        index:index+1
    }
}