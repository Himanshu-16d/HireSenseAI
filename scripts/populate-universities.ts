import { createClient } from 'algoliasearch/lite';

const UNIVERSITIES = [
  "Harvard University",
  "Massachusetts Institute of Technology",
  "Stanford University",
  "University of California, Berkeley",
  "University of Cambridge",
  "University of Oxford",
  "California Institute of Technology",
  "Princeton University",
  "Yale University",
  "University of Chicago",
  "Columbia University",
  "University of Pennsylvania",
  "University of Michigan",
  "University of Toronto",
  "University of British Columbia",
  "McGill University",
  "University of Waterloo",
  "University of California, Los Angeles",
  "New York University",
  "Carnegie Mellon University",
  "Georgia Institute of Technology",
  "University of Illinois at Urbana-Champaign",
  "University of Texas at Austin",
  "University of Washington",
  "Cornell University",
  "University of Wisconsin-Madison",
  "University of Maryland",
  "University of California, San Diego",
  "University of California, Davis",
  "University of California, Irvine",
  "University of Minnesota",
  "University of Virginia",
  "University of North Carolina at Chapel Hill",
  "Duke University",
  "Johns Hopkins University",
  "Northwestern University",
  "Rice University",
  "University of Notre Dame",
  "Vanderbilt University",
  "Washington University in St. Louis",
  "Brown University",
  "Dartmouth College",
  "University of Southern California",
  "University of Florida",
  "University of Texas at Dallas",
  "University of Arizona",
  "Arizona State University",
  "University of Colorado Boulder",
  "University of Utah",
  "University of Oregon",
  "University of Washington",
  "University of British Columbia",
  "Simon Fraser University",
  "University of Alberta",
  "University of Montreal",
  "University of Toronto",
  "University of Waterloo",
  "University of British Columbia",
  "McGill University",
  "University of Ottawa",
  "University of Calgary",
  "University of Victoria",
  "University of Saskatchewan",
  "University of Manitoba",
  "Dalhousie University",
  "University of New Brunswick",
  "Memorial University of Newfoundland",
  "University of Prince Edward Island",
  "Acadia University",
  "Mount Allison University",
  "St. Francis Xavier University",
  "University of King's College",
  "Bishop's University",
  "Trent University",
  "Lakehead University",
  "Laurentian University",
  "University of Windsor",
  "University of Guelph",
  "University of Western Ontario",
  "Queen's University",
  "McMaster University",
  "University of Toronto",
  "Ryerson University",
  "York University",
  "University of Ontario Institute of Technology",
  "Carleton University",
  "University of Ottawa",
  "University of Quebec",
  "Concordia University",
  "University of Montreal",
  "University of Sherbrooke",
  "University of Laval",
  "University of Quebec at Montreal",
  "University of Quebec at Trois-Rivieres",
  "University of Quebec at Chicoutimi",
  "University of Quebec at Rimouski",
  "University of Quebec at Abitibi-Temiscamingue",
  "University of Quebec at Outaouais"
];

async function populateUniversities() {
  const searchClient = createClient('3JV7V8Z2LL', 'd4122b450cbdfbe2af0db37ba6d956f7');
  const index = searchClient.initIndex('universities');

  // Prepare records with objectID
  const records = UNIVERSITIES.map((name, i) => ({
    objectID: i.toString(),
    name
  }));

  try {
    // Save records to Algolia
    const { objectIDs } = await index.saveObjects(records);
    console.log('Successfully saved universities to Algolia:', objectIDs);
  } catch (error) {
    console.error('Error saving universities to Algolia:', error);
  }
}

populateUniversities(); 