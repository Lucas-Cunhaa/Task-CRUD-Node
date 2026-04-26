import fs from 'node:fs'
const dataPath = new URL('../data/tasks.csv', import.meta.url)

const head = "title, description"
fs.writeFileSync(dataPath, head, 'utf-8')

const stream = fs.createWriteStream(dataPath, { flags: "w" });
stream.write(head);

const verbsBase = [
  "Estudar", "Implementar", "Refatorar", "Testar", "Corrigir",
  "Documentar", "Configurar", "Deployar", "Analisar", "Otimizar"
];

const topicsBase = [
  "API", "Frontend", "Backend", "Docker", "CI/CD",
  "Banco de Dados", "Autenticação", "Performance", "Logs", "Segurança"
];

// gera 1000 variações
const verbs = Array.from({ length: 1000 }, (_, i) => {
  const base = verbsBase[i % verbsBase.length];
  return `${base} ${i + 1}`;
});

const topics = Array.from({ length: 1000 }, (_, i) => {
  const base = topicsBase[i % topicsBase.length];
  return `${base} ${i + 1}`;
});

for (let i = 0; i < verbs.length; i++) {
    for (let j = 0; j < topics.length; j++) {
        const title = topics[j]
        const description = `${verbs[i]} ${topics[j]}`

        if (!stream.write(`${title},${description}\n`)) {
             await new Promise(resolve => stream.once("drain", resolve));
        }

        if (j % 100 === 0) {
            console.log(`Escrevendo linha ${i}-${j}`);
        }
    }
    
}

stream.end(() => {
  console.log(dataPath + "tasks were generated");
});

