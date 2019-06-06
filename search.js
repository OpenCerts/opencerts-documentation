const searchClient = algoliasearch(
  "S3C08S8B4J",
  "056213421be11efac77405cf958ade15"
);

const search = instantsearch({
  indexName: "jekyll",
  searchClient
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#search-box",
    placeholder: "Search the docs..."
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: "No results",
      item: "<em>Hit {{objectID}}</em>: {{{_highlightResult.content.value}}}"
    }
  })
);

search.start();
