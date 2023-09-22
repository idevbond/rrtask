/**
 * This date will be used if no influence is provided
 */
const defaultInfluence = {
    price_eur: 0.3, duration_out_sec: 0.7
};

/**
 * The RankGenerator class implements an application that
 * calculates the rank of each element from array using coefficients
 * of influence on fields and quick sort for best performance
 */
export class RouteRankGenerator {
    constructor(influence) {
        this.updateInfluence(influence);
    }

    /**
     * The method below determines coefficients and their
     * negative or positive value for the final result, for example:
     * duration(less is better), workTime(more is better), lessIsBetter: true/false
     * @param {Object} influence - object of influence
     */

    updateInfluence(influence) {
        this.influence = {};

        this.influenceFields = Object.keys(influence || defaultInfluence);
        this.influenceFields.forEach(k => this.influence[k] = 
            influence ? {
                ...influence[k],
                coefficient: parseInt(influence[k].coefficient)/100
            } : {
                coefficient: defaultInfluence[k],
                lessIsBetter: true
            }
        );
    }

    /**
     * The method below calculates the maximum value of each field of influence
     * in the routes and the score for each route by summing each field rank
     * using the less/more rule, uses quickSort to get rank and sort.
     * @param {Object[]} dataInput - array of routes
     * @returns {Object[]} - array of sorted routes with score and rank
     */

    createRouteRank(dataInput) {
        const data = [ ...dataInput ], dataLen = data.length;

        if(dataLen == 1) {
            data[0].score = 1;
            data[0].rank = 1;
        } else if(dataLen > 1) {
            for(const fieldName of this.influenceFields) {
                this.influence[fieldName].maximum = data[0][fieldName];
            }

            for(let i=1; i<dataLen; i++) {
                for(const fieldName of this.influenceFields) {
                    if(this.influence[fieldName].maximum < data[i][fieldName]) {
                        this.influence[fieldName].maximum = data[i][fieldName];
                    }
                }
            }

            for(const route of data) {
                route.score = 0;
                for(const fieldName of this.influenceFields) {
                    const { coefficient, lessIsBetter, maximum } = this.influence[fieldName];
                    route.score += (route[fieldName]/maximum)*coefficient*(lessIsBetter ? 1 : -1);
                }
                route.score = route.score.toFixed(6);
            }

            this.quickSort(data, 0, data.length-1);
        }
        return data;
    }

    /**
     * This recursive method sorts route objects by score 
     * and assigns a rank in the provided array
     * @param {Object[]} arr 
     * @param {number} from 
     * @param {number} to 
     * @returns 
     */

    quickSort(arr, from, to) {
        if(from >= to || from < 0)
            return;

        const pi = this.quickSortPartition(arr, from, to);
        this.quickSort(arr, from, pi - 1);
        this.quickSort(arr, pi + 1, to);
    };

    /**
     * The method sorts elements of array by indexes(from/to)
     * and assigns a rank
     * @param {Object[]} arr 
     * @param {number} from 
     * @param {number} to 
     * @returns {number}
     */

    quickSortPartition(arr, from, to) {
        const pivot = arr[to];

        let tempIndex = from-1;

        for(let i = from; i < to; i++) {
            if(arr[i].score <= pivot.score) {
                tempIndex++;

                const temp = arr[tempIndex];
                arr[tempIndex] = arr[i];
                arr[i] = temp;

                arr[i].rank = i+1;
                arr[tempIndex].rank = i+1;
            }
        }

        tempIndex++;
        arr[to] = arr[tempIndex];
        arr[tempIndex] = pivot;

        arr[to].rank = to+1;
        arr[tempIndex].rank = tempIndex+1;

        return tempIndex;
    };
}