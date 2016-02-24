SQSP.functions.initPage = function() {

    console.log('init page');

    SQSP.functions.createEpisodeHero();

    SQSP.functions.windowLoad.push(function() {
        console.log('Page Episode loaded');
    });

};