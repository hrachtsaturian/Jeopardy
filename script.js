
let categories = [];

async function getCategoryIds() {
  const res = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');

  const resShuffled = _.shuffle(res.data);
  
  return resShuffled.slice(0, 6);
}

async function getCategory(catId) {
  const res = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
  return res.data;
}

function fillTable(data) {
  const titles = data.map((object) => { 
    return object.title;
  });

  const jeopardyTable = document.querySelector('#jeopardy-table');
  const headerRow = document.createElement('tr');
  
  titles.forEach((title) => {
    const titleHeader = document.createElement('th');
    titleHeader.innerHTML = title.toUpperCase();
    titleHeader.className = 'table-title';
    headerRow.appendChild(titleHeader);
  })

  jeopardyTable.appendChild(headerRow);

  for (let i = 0; i < data[0].clues_count; i++) {
    const cluesRow = document.createElement('tr');

    for (let j = 0; j < data.length; j++) {
      const card = document.createElement('td')
      card.className = 'table-question';
      
      const questionMark = document.createElement('div')
      questionMark.innerHTML = `$${100 * 2 * (i + 1)}`;
      questionMark.style.color ='white';

      const clue = document.createElement('div')
      clue.style.display = 'none';
      clue.innerHTML = data[j].clues[i].question;
      
      const answer = document.createElement('div')
      answer.style.display = 'none';
      answer.innerHTML = data[j].clues[i].answer;

      
      card.addEventListener('click', (e) => {
        const isClueOpen = card.className !== 'table-question';

        if (isClueOpen) {
          card.className = 'table-answer';
          clue.style.display = 'none';
          answer.style.display = 'block';
        }
        else {
          card.className = 'table-clue';
          questionMark.style.display = 'none';
          clue.style.display = 'block';
        }
      })

      card.appendChild(questionMark);
      card.appendChild(clue);
      card.appendChild(answer);
      cluesRow.appendChild(card);
    }

    jeopardyTable.appendChild(cluesRow);
  }
}

async function setupAndStart() {
  const categories = await getCategoryIds();
  
  const data = [];
  
  for (const category of categories) {
    const clues = await getCategory(category.id);
    data.push(clues);
  }

  return data;
}

$( "#restart" ).on( "click", async function() {
  const progressCircle = document.querySelector('#progress-indicator');
  if (progressCircle.style.display === 'block') return;
  
  const jeopardyTable = document.querySelector('#jeopardy-table');
  if (jeopardyTable) {  
   jeopardyTable.innerHTML = null;
  }

  progressCircle.style.display = 'block'

  const data = await setupAndStart();

  progressCircle.style.display = 'none'

  const button = document.querySelector('#restart');
  button.innerHTML = "Restart!";

  fillTable(data);
} );
