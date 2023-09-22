import { promises as fs } from 'fs';
import { RouteRankGenerator } from './classes/rank-generator.js';
const loadFile = async(path) => JSON.parse(await fs.readFile(path));

/**
 * The code below is loads input data and the fields 
 * that will affect the rank from files, 
 * creates rank and stores the sorted data
 * with 2 new fields: score and rank in the file
 */

(async () => {
    try {
        const data = await loadFile('./data/ex3-data.json');
        const influence = await loadFile('./config/influence-on-the-rank.json');
        
        const rankGenerator = new RouteRankGenerator(influence);
        const result = rankGenerator.createRouteRank(data);
        console.log('Rank created successfully');
        if(result) {
            await fs.writeFile('./data/ex3-output.json', JSON.stringify(result));
            console.log('Data saved successfully in ex3-output.json');
        }
    } catch(e) {
        console.error(e);
    }
})();