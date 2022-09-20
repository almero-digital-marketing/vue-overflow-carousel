<template>
  <div class="counter">
    {{ active }} 
    <button @click="active--">Prev</button>
    &nbsp;
    <button @click="active++">Next</button>
    &nbsp;
    <button @click="active = 0">First</button>
  </div>
  <Carousel id="carousel-1" :slides-per-page="2" :enabled="true" :duration=".4" v-model="active" gap="10px" :debug="false">
    <Slide>
      0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.
    </Slide>
    <Slide>
      1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.
    </Slide>
    <Slide>
      2. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.
    </Slide>
    <Slide>
      3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.
    </Slide>
    <Slide>
      4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.
    </Slide>
    <Slide>
      5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.
    </Slide>
    <Slide>
      6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.
    </Slide>
    <Slide>
      7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.
    </Slide>
    <Slide>
      8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.
    </Slide>
    <Slide>
      9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.
    </Slide>
    <Slide>
      10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.
    </Slide>
    <Slide>
      11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.
    </Slide>
    <Slide>
      12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.
    </Slide>
    <Slide>
      13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.
    </Slide>
    <Slide>
      14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.
    </Slide>
  </Carousel>
  <div class="markers">
    <Carousel class="carousel-2" :capture-scroll="true" :center="true" slide-gap="100px" track-gap="200px" v-model="active" :overlay="true" >
      <template #overlay="overlay">
        <div class="wheel">
          <div class="circle">{{ overlay.progress }}</div>
        </div>
      </template>
      <template v-slot="carousel">
        <Slide>
          0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim.
        </Slide>
        <Slide>
          1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.
        </Slide>
        <Slide>
          {{carousel.current == 2 ? 'Active' : '2'}}. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.
        </Slide>
        <Slide>
          3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.
        </Slide>
        <Slide>
          4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.
        </Slide>
        <Slide>
          5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.
        </Slide>
        <Slide>
          6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.
        </Slide>
        <Slide>
          7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.
        </Slide>
        <Slide>
          8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.
        </Slide>
        <Slide>
          9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.
        </Slide>
        <Slide>
          10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.
        </Slide>
        <Slide>
          11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.
        </Slide>
        <Slide>
          12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.
        </Slide>
        <Slide>
          13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.
        </Slide>
        <Slide>
          14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.
        </Slide>
      </template>
    </Carousel>
  </div>



  <div class="markers">
    <Carousel class="carousel-2" ref="navigation" :capture-scroll="true" :center="false" :center-first="false" :center-last="false" slide-gap="100px" track-gap="200px" :overlay="true" :snap="false" :debug="true">
      <template #overlay="navigation">
        <div class="wheel">
          <div class="circle">{{ navigation.progress }}</div>
          <button @click="navigation.prev()">Prev</button>
          <button @click="navigation.next(2)">Next</button>
        </div>
      </template>
      <template v-slot="carousel">
        <Slide>
          0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim.
        </Slide>
        <Slide>
          1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.
        </Slide>
        <Slide>
          {{carousel.current == 2 ? 'Active' : '2'}}. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.
        </Slide>
        <Slide>
          3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.
        </Slide>
        <Slide>
          4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.
        </Slide>
        <Slide>
          5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.
        </Slide>
        <Slide>
          6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.
        </Slide>
        <!-- <Slide>
          7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.
        </Slide>
        <Slide>
          8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.
        </Slide>
        <Slide>
          9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.
        </Slide>
        <Slide>
          10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.
        </Slide>
        <Slide>
          11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.
        </Slide>
        <Slide>
          12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.
        </Slide>
        <Slide>
          13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.
        </Slide>
        <Slide>
          14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.
        </Slide> -->
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
          0. Lorem ipsum dolor sit, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te
            <strong v-drag-click @click="test">amet</strong> Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim, nostrum patrioque te ius. Dicant blandit ut nam.0. Lorem ipsum dolor sit amet, cum ut movet dictas scribentur, dicta saperet vix te. Mea graece sententiae id, ei qui mundi pericula adipiscing. At mucius facilisis dissentiunt vim.
        </Slide>
        <Slide>
          1. Qui et assum labore assueverit. Corpora suscipiantur sit et. Fugit oblique torquatos et vel. Cu eos hinc volumus, duis nusquam corrumpit id has. Te ius debet propriae splendide.
        </Slide>
        <Slide>
          {{carousel.current == 2 ? 'Active' : '2'}}. At ius harum integre intellegam, ei ipsum nostro quaestio eos, legendos quaerendum mea ex. Melius recteque mediocritatem ut sea. An adhuc exerci deserunt usu. Eum persius sententiae reprehendunt id, id per error repudiandae. Id erroribus elaboraret liberavisse vim, in est graeco qualisque. In tibique probatus mea, pri eu aliquando reprimique eloquentiam.
        </Slide>
        <Slide>
          3. Ea mei nobis nominati elaboraret, probo pericula per et. An qui oporteat rationibus theophrastus. Stet consul patrioque et cum. Iracundia reprimique ei pri. Id veri possim usu, vim nihil albucius definitiones in. Cu etiam delenit debitis mel.
        </Slide>
        <Slide>
          4. Prima quidam vivendum per an, qui an electram accusamus. Dolor scribentur nam an. Vis ea ancillae accusamus adolescens, ut aliquam torquatos cotidieque mel. Libris graecis argumentum eos ne, ut denique deserunt cum. Sea an quot adversarium, an ius tempor commodo praesent, velit labore definitionem sed no. Ne nihil dolor vituperata pro, mel simul molestiae constituto id.
        </Slide>
        <Slide>
          5. Lorem ipsum dolor sit amet, nec in quis docendi. Pri unum audire atomorum at. Oblique nominati appellantur vis an, saepe salutandi argumentum id est, ne veritus voluptatibus eam. Erat intellegam his in, ad cum nulla scripta forensibus.
        </Slide>
        <Slide>
          6. Ubique quaestio consulatu vel et. Cu mea cetero consectetuer, est et sale commodo. At dicit meliore ocurreret has, id pri mazim torquatos. Id his adipisci mandamus, has deserunt deseruisse eu, eam ne sint vide. Cum at malorum necessitatibus, ea duo iudico partem.
        </Slide>
        <Slide>
          7. Ea duis lucilius delicatissimi per, id quo natum feugiat definitionem. No vis error forensibus. Quis dicta dolorum nec ne. Abhorreant instructior mediocritatem an mea. Oportere abhorreant est te. Ferri mnesarchum ea eos. Cum te perfecto disputando.
        </Slide>
        <Slide>
          8. Usu natum libris iracundia eu, paulo solet invidunt duo id. Assueverit dissentiet id vix, sea ex oporteat electram. Nostro utamur ex eam. Pri alii integre in, suas labore principes eum in. His ei iusto equidem epicurei, rebum dolorum mel no. Nonumy numquam conceptam nam ad, eros denique persequeris ad est.
        </Slide>
        <Slide>
          9. Vim possit melius constituam ad. Eum an vidit iudico ubique, eam cu ceteros maiorum minimum. Ea quo minim recteque facilisis, esse officiis cu vim. Est eros consequuntur ex, nominavi erroribus no his, ut eos volumus salutatus. Est unum adipiscing adversarium id.
        </Slide>
        <Slide>
          10. Ad ius probo invenire quaerendum, quo ad vivendum gubergren disputando. Qui at labore facete sensibus, in voluptua dignissim hendrerit sed. Mea offendit adversarium cu, eos habeo persius fabulas cu, te sea vidisse prodesset persecuti. Ferri omnes definiebas his an, no vis simul tamquam.
        </Slide>
        <Slide>
          11. Justo inimicus suscipiantur eam ut, essent causae menandri id cum. Nostrud evertitur te per. Rebum numquam philosophia eu has, sint utinam elaboraret ius et. Est id purto abhorreant, eu nec debet zril perfecto. Et alii quot nominavi sit, mea congue iudico at. At vix meis commune omittantur.
        </Slide>
        <Slide>
          12. Soluta labores instructior pri no, dolore habemus platonem vis eu. Quo sensibus perpetua consulatu ea. Est quem viderer praesent in. Alii ubique prodesset qui ut, eam ex senserit pertinacia cotidieque. Vim ea nihil laboramus appellantur.
        </Slide>
        <Slide>
          13. Ad adhuc propriae cum. Cotidieque omittantur complectitur ei nam, cibo scripta quaeque mea at. Te aliquam impedit sensibus pro, debet erroribus eos ad, ei usu insolens elaboraret referrentur. Etiam utroque definitiones eu mel.
        </Slide>
        <Slide>
          14. Ex vel hinc latine interpretaris, te veritus blandit eum, fabellas perpetua inciderint te eos. Sed scaevola lobortis ne, everti definitionem ad pro. Ut copiosae explicari elaboraret usu, nam at copiosae accusata. Ea pri mucius insolens. Qui adhuc denique te, id sensibus mandamus quo.
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
const navigation = ref(0)

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
  width: 40vw;
  position: relative;
  background-color: gainsboro;
}
#carousel-1 .slide {
  border: 1px solid green;
  min-height: 20vw;
  /* width: 20vw; */
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
.carousel-2 .slide {
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
.carousel-2 .active .slide {
  background-color: bisque;
}
.carousel-2 .slide::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 50px;
  background-color: green;
  top: 0;
  left: 25%;
  z-index: 10;
}
.carousel-2 .slide::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 50px;
  background-color: green;
  top: 0;
  left: 75%;
  z-index: 10;
}
.carousel-2 .slide:nth-child(7) .slide {
  width: 200px;
}
.carousel-2 .slide:nth-child(9) .slide {
  width: 60vw;
}
.counter {
  position: fixed;
  top: 0;
  left: 0;
}
.placeholder { 
  /* border: 1px solid purple; */
}
body {
  padding-bottom: 200vh;
}
</style>
