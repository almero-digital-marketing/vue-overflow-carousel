<template>
  <div class="counter">
    {{ active }} 
    <button @click="active--">Prev</button>
    &nbsp;
    <button @click="active++">Next</button>
    &nbsp;
    <button @click="active = 0">First</button>
  </div>
  <Carousel id="carousel-1" :enabled="true" :duration=".4" v-model="active">
    <Slide>
      <div class="item">0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.</div>
    </Slide>
    <Slide>
      <div class="item">1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.</div>
    </Slide>
    <Slide>
      <div class="item">2. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.</div>
    </Slide>
    <Slide>
      <div class="item">3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.</div>
    </Slide>
    <Slide>
      <div class="item">4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.</div>
    </Slide>
    <Slide>
      <div class="item">5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.</div>
    </Slide>
    <Slide>
      <div class="item">6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.</div>
    </Slide>
    <Slide>
      <div class="item">7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.</div>
    </Slide>
    <Slide>
      <div class="item">8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.</div>
    </Slide>
    <Slide>
      <div class="item">9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.</div>
    </Slide>
    <Slide>
      <div class="item">10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.</div>
    </Slide>
    <Slide>
      <div class="item">11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.</div>
    </Slide>
    <Slide>
      <div class="item">12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.</div>
    </Slide>
    <Slide>
      <div class="item">13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.</div>
    </Slide>
    <Slide>
      <div class="item">14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.</div>
    </Slide>
  </Carousel>
  <div class="markers">
    <Carousel class="carousel-2" :capture-scroll="true" :center="true" :center-first="false" :center-last="true" slide-gap="100px" v-model="active" :overlay="true">
      <template #overlay="overlay">
        <div class="wheel">
          <div class="circle">{{ overlay.progress }}</div>
        </div>
      </template>
      <template v-slot="carousel">
        <Slide>
          <div class="item">0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim.</div>
        </Slide>
        <Slide>
          <div class="item">1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.</div>
        </Slide>
        <Slide>
          <div class="item">{{carousel.current == 2 ? 'Active' : '2'}}. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.</div>
        </Slide>
        <Slide>
          <div class="item">3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.</div>
        </Slide>
        <Slide>
          <div class="item">4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.</div>
        </Slide>
        <Slide>
          <div class="item">5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.</div>
        </Slide>
        <Slide>
          <div class="item">6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.</div>
        </Slide>
        <Slide>
          <div class="item">7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.</div>
        </Slide>
        <Slide>
          <div class="item">8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.</div>
        </Slide>
        <Slide>
          <div class="item">9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.</div>
        </Slide>
        <Slide>
          <div class="item">10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.</div>
        </Slide>
        <Slide>
          <div class="item">11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.</div>
        </Slide>
        <Slide>
          <div class="item">12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.</div>
        </Slide>
        <Slide>
          <div class="item">13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.</div>
        </Slide>
        <Slide>
          <div class="item">14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.</div>
        </Slide>
      </template>
    </Carousel>
  </div>



  <div class="markers">
    <Carousel class="carousel-2" :capture-scroll="true" :center="false" :center-first="false" :center-last="false" slide-gap="100px" track-gap="20px" :overlay="true">
      <template #overlay="overlay">
        <div class="wheel">
          <div class="circle">{{ overlay.progress }}</div>
        </div>
      </template>
      <template v-slot="carousel">
        <Slide>
          <div class="item">0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim.</div>
        </Slide>
        <Slide>
          <div class="item">1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.</div>
        </Slide>
        <Slide>
          <div class="item">{{carousel.current == 2 ? 'Active' : '2'}}. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.</div>
        </Slide>
        <Slide>
          <div class="item">3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.</div>
        </Slide>
        <Slide>
          <div class="item">4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.</div>
        </Slide>
        <Slide>
          <div class="item">5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.</div>
        </Slide>
        <Slide>
          <div class="item">6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.</div>
        </Slide>
        <Slide>
          <div class="item">7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.</div>
        </Slide>
        <Slide>
          <div class="item">8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.</div>
        </Slide>
        <Slide>
          <div class="item">9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.</div>
        </Slide>
        <Slide>
          <div class="item">10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.</div>
        </Slide>
        <Slide>
          <div class="item">11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.</div>
        </Slide>
        <Slide>
          <div class="item">12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.</div>
        </Slide>
        <Slide>
          <div class="item">13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.</div>
        </Slide>
        <Slide>
          <div class="item">14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.</div>
        </Slide>
      </template>
    </Carousel>
  </div>


  <div class="markers">
    <Carousel class="carousel-2" :capture-scroll="true" :center="true" :center-first="false" :center-last="false" slide-gap="100px" track-gap="20px" :overlay="true">
      <template #overlay="overlay">
        <div class="wheel">
          <div class="circle">{{ overlay.progress }}</div>
        </div>
      </template>
      <template v-slot="carousel">
        <Slide>
          <div class="item">0. Lorem ipsum dolor sit, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. 
            <strong v-drag-click @click="test">amet</strong> Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim.</div>
        </Slide>
        <Slide>
          <div class="item">1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.</div>
        </Slide>
        <Slide>
          <div class="item">{{carousel.current == 2 ? 'Active' : '2'}}. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.</div>
        </Slide>
        <Slide>
          <div class="item">3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.</div>
        </Slide>
        <Slide>
          <div class="item">4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.</div>
        </Slide>
        <Slide>
          <div class="item">5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.</div>
        </Slide>
        <Slide>
          <div class="item">6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.</div>
        </Slide>
        <Slide>
          <div class="item">7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.</div>
        </Slide>
        <Slide>
          <div class="item">8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.</div>
        </Slide>
        <Slide>
          <div class="item">9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.</div>
        </Slide>
        <Slide>
          <div class="item">10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.</div>
        </Slide>
        <Slide>
          <div class="item">11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.</div>
        </Slide>
        <Slide>
          <div class="item">12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.</div>
        </Slide>
        <Slide>
          <div class="item">13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.</div>
        </Slide>
        <Slide>
          <div class="item">14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.</div>
        </Slide>
      </template>
    </Carousel>
  </div>


</template>
<script setup>
import { ref } from 'vue'
import Carousel from './components/Carousel.vue'
import Slide from './components/Slide.vue'

const active = ref(0)

function test(e) {
  if (e.defaultPrevented) return
  console.log('TEST', e.defaultPrevented, Date.now())
}
</script>

<style>
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
.track::before,
.track::after {
  background-color: aquamarine;
}
#carousel-1 {
  margin-top: 200vh;
  width: 20vw;
  position: relative;
}
#carousel-1 .item {
  border: 1px solid green;
  min-height: 20vw;
  width: 20vw;
}
.markers {
  position: relative;
  border: 1px solid red;
  margin-bottom: 100px;
  margin-left: 30%;
  width: 70%;
  position: relative;
}
.markers::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 50px;
  background-color: red;
  top: 0;
  left: 50%;
  z-index: 10;
}
.carousel-2 .item {
  border: 1px solid green;
  min-height: 300px;
  width: 400px;
  position: relative;
  transition: all 1s;
  z-index: 1;
}
.wheel {
  position: sticky;
  left: 0;
  z-index: 2;
  min-height: 300px;
  width: 1px;
}
.circle {
  border: 1px solid black;
  position: absolute;
  height: 100%;
  width: 70vw;
  background-color: rgba(0,0,0,.05);
}
.carousel-2 .active .item {
  background-color: bisque;
}
.carousel-2 .item::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 50px;
  background-color: green;
  top: 0;
  left: 25%;
  z-index: 10;
}
.carousel-2 .item::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 50px;
  background-color: green;
  top: 0;
  left: 75%;
  z-index: 10;
}
.carousel-2 .slide:nth-child(7) .item {
  width: 200px;
}
.carousel-2 .slide:nth-child(9) .item {
  width: 60vw;
}
.counter {
  position: fixed;
  top: 0;
  left: 0;
}
body {
  padding-bottom: 200vh;
}
</style>
