/**
 * Cluster-Based Correlation Engine — 30,000+ effective rules
 * ~260 clusters × ~900 cross-cluster relationships → 35,000+ tag-pair rules
 */

// ═══════════════════════════════════════════════
//  TAG CLUSTERS (~260 clusters)
// ═══════════════════════════════════════════════

const C: Record<string, string[]> = {
  /* ── Character ── */
  girl:      ['1girl','solo','female_focus'],
  boy:       ['1boy','male_focus'],
  multi_g:   ['2girls','3girls','4girls','5girls','6+girls','multiple_girls','yuri','girl_on_girl'],
  multi_b:   ['2boys','3boys','4boys','multiple_boys','yaoi','boy_on_boy'],
  couple:    ['1girl_1boy','couple','hetero','mixed-sex_group','male_and_female'],
  child:     ['loli','shota','child','young_girl','young_boy','teenager','toddler'],
  mature:    ['mature_female','mature_male','milf','dilf','adult','older','middle-aged'],
  musc:      ['muscular','muscular_female','muscular_male','abs','toned','athletic','six-pack','biceps','well-built'],
  slim:      ['slim','slender','thin','petite','skinny','lean','willowy'],
  curvy:     ['curvy','voluptuous','wide_hips','thick_thighs','hourglass_figure','busty'],
  chubby:    ['chubby','plump','fat','overweight','round','soft_body'],

  /* ── Hair Color (12 clusters) ── */
  h_blonde:  ['blonde_hair','golden_hair','platinum_blonde_hair','ash_blonde_hair','light_brown_hair','strawberry_blonde','dirty_blonde'],
  h_black:   ['black_hair','dark_hair','jet_black_hair','raven_hair','dark_brown_hair','ebony_hair'],
  h_brown:   ['brown_hair','chestnut_hair','auburn_hair','caramel_hair','mahogany_hair','honey_hair','cocoa_hair'],
  h_red:     ['red_hair','dark_red_hair','cherry_hair','wine_hair','copper_hair','crimson_hair','scarlet_hair'],
  h_blue:    ['blue_hair','dark_blue_hair','light_blue_hair','aqua_hair','cyan_hair','sapphire_hair','navy_hair'],
  h_pink:    ['pink_hair','light_pink_hair','rose_gold_hair','magenta_hair','salmon_hair','bubblegum_hair'],
  h_purple:  ['purple_hair','lavender_hair','light_purple_hair','dark_purple_hair','indigo_hair','violet_hair','plum_hair'],
  h_white:   ['white_hair','silver_hair','grey_hair','platinum_hair','snow_white_hair','ash_grey_hair'],
  h_green:   ['green_hair','light_green_hair','dark_green_hair','mint_hair','teal_hair','lime_hair','emerald_hair'],
  h_orange:  ['orange_hair','peach_hair','honey_hair','coral_hair','ginger_hair','apricot_hair'],
  h_multi:   ['multicolored_hair','gradient_hair','two-tone_hair','rainbow_hair','streaked_hair','colored_inner_hair','colored_tips'],
  h_tentacle:['tentacle_hair','wire_hair','flame_hair','crystal_hair','slime_hair'],

  /* ── Hair Style (12 clusters) ── */
  hs_long:   ['long_hair','very_long_hair','absurdly_long_hair','hair_past_waist','thigh-length_hair','knee-length_hair'],
  hs_short:  ['short_hair','very_short_hair','bob_cut','pixie_cut','buzz_cut','crew_cut','page_cut','ear-length_hair'],
  hs_medium: ['medium_hair','shoulder-length_hair','chin-length_hair','neck-length_hair'],
  hs_twin:   ['twintails','low_twintails','short_twintails','high_twintails','odango','space_buns'],
  hs_pony:   ['ponytail','high_ponytail','low_ponytail','side_ponytail','folded_ponytail','half_up_half_down','short_ponytail'],
  hs_braid:  ['braid','twin_braids','side_braid','french_braid','fishtail_braid','crown_braid','milkmaid_braid','dutch_braid','box_braids'],
  hs_bun:    ['hair_bun','double_bun','single_hair_bun','chignon','top_knot','messy_bun','doughnut_hair_bun','cone_hair_bun'],
  hs_wavy:   ['wavy_hair','curly_hair','ringlets','drill_hair','afro','dreadlocks','cornrows','natural_hair'],
  hs_straight:['straight_hair','hime_cut','blunt_cut','choppy_hair','layered_hair','razor_cut'],
  hs_messy:  ['messy_hair','disheveled_hair','bedhead','tousled_hair','windswept_hair','floating_hair','unkempt_hair','wild_hair'],
  hs_bangs:  ['bangs','blunt_bangs','parted_bangs','swept_bangs','side_bangs','hair_over_one_eye','hair_between_eyes','ahoge','antenna_hair','sidelocks'],
  hs_bald:   ['bald','shaved_head','receding_hairline'],

  /* ── Eye Color (10 clusters) ── */
  e_blue:    ['blue_eyes','aqua_eyes','cyan_eyes','teal_eyes','sapphire_eyes','arctic_eyes'],
  e_red:     ['red_eyes','crimson_eyes','scarlet_eyes','ruby_eyes','bloodshot_eyes','wine_eyes'],
  e_green:   ['green_eyes','emerald_eyes','jade_eyes','mint_eyes','forest_eyes'],
  e_brown:   ['brown_eyes','amber_eyes','hazel_eyes','chocolate_eyes','honey_eyes'],
  e_purple:  ['purple_eyes','violet_eyes','lavender_eyes','amethyst_eyes','mauve_eyes','orchid_eyes'],
  e_pink:    ['pink_eyes','rose_eyes','magenta_eyes','cherry_eyes'],
  e_yellow:  ['yellow_eyes','golden_eyes','topaz_eyes','amber_eyes_bright'],
  e_grey:    ['grey_eyes','silver_eyes','white_eyes','steel_eyes'],
  e_hetero:  ['heterochromia','multicolored_eyes','gradient_eyes','different_colored_eyes'],
  e_glow:    ['glowing_eyes','sparkling_eyes','shining_eyes','luminous_eyes','bright_eyes','radiant_eyes'],

  /* ── Expressions (7 positive + 5 negative + 3 neutral = 15) ── */
  ex_happy:  ['smile','grin','happy','cheerful','laughing','beaming','delighted',':d','open_mouth_smile','grinning','joyful','radiant'],
  ex_gentle: ['soft_smile','gentle','kind','warm','content','serene','peaceful','calm','tender','sweet_smile'],
  ex_play:   ['playful','mischievous','teasing','wink','tongue_out',':p',':3','smirk','sly','naughty'],
  ex_excite: ['excited','ecstatic','surprised','amazed','sparkle_eyes','wide_eyes_smile','overjoyed','star_eyes'],
  ex_proud:  ['proud','confident','smug','triumphant','victorious','bold','self-assured'],
  ex_embar:  ['embarrassed','blushing','shy','flustered','looking_away','bashful','abashed','timid','coy'],
  ex_think:  ['thinking','pensive','contemplative','thoughtful','hand_on_chin','pondering','reflective'],
  ex_serious:['serious','determined','stern','focused','stoic','expressionless','poker_face','determined_expression','grim'],
  ex_sleepy: ['sleepy','drowsy','yawning','tired','exhausted','half-closed_eyes','heavy_eyelids','fatigued','listless'],
  ex_sad:    ['sad','crying','tears','depressed','melancholy','lonely','sorrowful','grieving','weeping','sobbing','teary'],
  ex_angry:  ['angry','furious','annoyed','glaring','scowling','clenched_teeth','shouting','screaming','irritated','mad'],
  ex_scared: ['scared','frightened','terrified','panicked','trembling','shaking','horrified','alarmed','fearful'],
  ex_cool:   ['cool','nonchalant','unfazed','aloof','detached','indifferent','blasé'],
  ex_love:   ['loving','affectionate','adoring','devoted','heart_eyes','swooning','lovestruck','passionate_gaze'],
  ex_pain:   ['pain','hurt','wincing','grimacing','suffering','agonized','strained'],

  /* ── Pose (10 clusters) ── */
  p_stand:   ['standing','contrapposto','hands_on_hips','arms_crossed','leaning','leaning_against_wall','arms_behind_back','at_attention'],
  p_gesture: ['peace_sign','waving','salute','pointing','thumbs_up','finger_gun','hand_up','finger_heart','hand_heart','victory_sign'],
  p_dynamic: ['running','jumping','fighting','kicking','punching','action_pose','dynamic_pose','combat_pose','mid-action','leaping'],
  p_sit:     ['sitting','sitting_on_chair','sitting_on_ground','seiza','cross-legged','indian_style','lotus_position','sitting_on_bench'],
  p_lie:     ['lying','lying_down','lying_on_back','lying_on_stomach','lying_on_side','reclining','sprawled','lounging','stretched_out'],
  p_kneel:   ['kneeling','crouching','squatting','on_all_fours','crawling','genuflection'],
  p_sleep:   ['sleeping','napping','asleep','eyes_closed','pillow','dozing','deep_sleep','unconscious'],
  p_hug:     ['hugging','embracing','hug','carrying','princess_carry','piggyback','cuddling','snuggling'],
  p_hands:   ['holding_hands','hand_holding','interlocked_fingers','arm_in_arm','linking_arms'],
  p_kiss:    ['kissing','kiss','kiss_on_cheek','kiss_on_forehead','kiss_on_lips','french_kiss','peck'],

  /* ── Camera (10 clusters) ── */
  cam_close: ['close-up','face_close-up','portrait','headshot','bust_shot','extreme_close-up'],
  cam_upper: ['upper_body','cowboy_shot','medium_shot','waist_shot','torso_shot'],
  cam_full:  ['full_body','wide_shot','long_shot','knee_shot','establishing_shot'],
  cam_above: ['from_above','bird\'s-eye_view','overhead_shot','top-down_view','aerial_view','looking_down_at'],
  cam_below: ['from_below','worm\'s-eye_view','low_angle','low_angle_shot','looking_up_at'],
  cam_side:  ['from_side','profile','side_view','three-quarter_view','lateral_view'],
  cam_behind:['from_behind','rear_view','looking_back','over_the_shoulder','back_view'],
  cam_pov:   ['pov','first-person_view','selfie','mirror_selfie','eye_level'],
  cam_dof:   ['depth_of_field','blurry_background','bokeh','shallow_dof','blur_effect','out_of_focus_background'],
  cam_dyna:  ['dutch_angle','dynamic_angle','fisheye','wide_angle','tilted_frame','cinematic_angle'],

  /* ── Clothing: School ── */
  cl_school: ['school_uniform','serafuku','sailor_collar','blazer','gakuran','school_blazer','school_cardigan','sailor_uniform'],
  cl_school2:['pleated_skirt','knee_socks','loafers','school_bag','necktie','school_ribbon','backpack','name_tag','school_badge'],
  lo_school: ['classroom','school','chalkboard','desk','hallway','rooftop','gym','library','schoolyard','blackboard','corridor'],
  ev_school: ['after_school','school_festival','graduation','entrance_ceremony','culture_festival','sports_day'],

  /* ── Clothing: Maid ── */
  cl_maid:   ['maid','maid_uniform','maid_headdress','maid_apron','french_maid','gothic_maid','head_maid','battle_maid'],
  cl_maid2:  ['apron','frills','lace','white_apron','black_dress','headband','knee_socks','mary_janes','peter_pan_collar','hairband'],
  lo_maid:   ['mansion','victorian','indoors','kitchen','dining_room','hallway','garden','parlor','foyer'],

  /* ── Clothing: Military ── */
  cl_mil:    ['military_uniform','military','army_uniform','navy_uniform','officer_uniform','camouflage','camo','field_uniform'],
  cl_mil2:   ['medal','dog_tags','boots','peaked_cap','epaulettes','holster','tactical_vest','salute','beret'],
  lo_mil:    ['battlefield','base','war','outdoors','trench','camp','fortress','barracks','bunker'],
  wp_gun:    ['gun','pistol','rifle','shotgun','sniper_rifle','machine_gun','assault_rifle','revolver','uzi','carbine'],

  /* ── Clothing: Fantasy ── */
  cl_fantsy: ['armor','full_armor','plate_armor','knight','cape','cloak','robe','chainmail','pauldron','gauntlet'],
  cl_fantsy2:['crown','tiara','gauntlet','shield','breastplate','greaves','sabaton','helm','bracer'],
  lo_fantsy: ['castle','ruins','dungeon','tower','throne_room','ancient_ruins','cathedral','temple','fortress','medieval_city'],
  wp_melee:  ['sword','katana','longsword','spear','lance','axe','dagger','scythe','staff','wand','claymore','rapier'],
  mg_fantsy: ['magic','magic_circle','glowing','enchanted','spell','aura','energy','dragon','phoenix','elf','elemental','runes'],

  /* ── Clothing: Japanese ── */
  cl_jp:     ['kimono','yukata','hakama','miko','shrine_maiden','japanese_clothes','furisode','uchikake','tomesode','happi'],
  cl_jp2:    ['obi','geta','tabi','kanzashi','hair_ornament','folding_fan','hair_stick','noshi','sensu','hachimaki'],
  lo_jp:     ['shrine','temple','torii','zen_garden','tatami','sliding_door','engawa','japanese_architecture','onsen','dojo'],
  ev_jp:     ['cherry_blossoms','autumn_leaves','fireworks','lantern','festival','matsuri','hanami','tanabata','summer_festival','shichi-go-san'],

  /* ── Clothing: Chinese ── */
  cl_cn:     ['chinese_clothes','hanfu','cheongsam','qipao','changshan','ruqun','tang_suit','aoqun'],
  cl_cn2:    ['jade_pendant','hair_crown','buyao','chinese_knot','embroidery','silk_ribbon','chinese_fan','paper_fan','chinese_umbrella'],
  lo_cn:     ['palace','pagoda','bamboo','chinese_architecture','mountain','cloud_sea','waterfall','bridge','misty','lotus_pond'],

  /* ── Clothing: Korean ── */
  cl_kr:     ['korean_clothes','hanbok','jeogori','chima','dangui'],
  lo_kr:     ['korean_palace','korean_architecture','korean_garden','traditional_village'],

  /* ── Clothing: Western/Gothic/Victorian ── */
  cl_vict:   ['victorian_dress','victorian_fashion','corset','bustle_dress','crinoline','hoop_skirt','petticoat','high_collar','lace_gloves'],
  cl_gothic: ['gothic','gothic_lolita','dark','black_dress','lace','corset','cross','choker','velvet','dark_lipstick'],
  cl_witch:  ['witch','witch_hat','witch_outfit','witch_robe','spellbook','broom','cauldron','familiar'],
  cl_lolita: ['lolita_fashion','sweet_lolita','classic_lolita','frills','petticoat','bonnet','parasol','bow','mary_jane','bloomers'],
  cl_pirate: ['pirate','pirate_hat','pirate_outfit','eyepatch','bandana','skull_and_crossbones','boots','coat'],

  /* ── Clothing: Modern ── */
  cl_casual: ['hoodie','t-shirt','jeans','sneakers','jacket','denim_jacket','tank_top','shorts','leggings','crop_top','sweater','sweatshirt'],
  cl_sporty: ['sportswear','jersey','track_jacket','running_shorts','yoga_pants','sports_bra','headband','leggings','track_pants'],
  cl_formal: ['suit','business_suit','tuxedo','formal_wear','dress_shirt','necktie','waistcoat','trench_coat','briefcase'],
  cl_dress:  ['dress','white_dress','black_dress','red_dress','evening_gown','cocktail_dress','long_dress','sundress','maxi_dress'],
  cl_swim:   ['bikini','swimsuit','one-piece_swimsuit','school_swimsuit','string_bikini','tankini','swim_trunks','monokini'],
  cl_under:  ['underwear','bra','panties','lingerie','negligee','stockings','garter_belt','corset_underwear','camisole'],
  cl_winterc:['coat','scarf','mittens','beanie','earmuffs','boots','sweater','turtleneck','warm_clothes','down_jacket','gloves'],
  cl_rain:   ['raincoat','umbrella','rain_boots','wet_clothes','poncho'],

  /* ── Clothing: Cyberpunk ── */
  cl_cyber:  ['cyberpunk','futuristic','sci-fi','neon','hologram','visor','cable','implant','mechanical','android','prosthetic'],
  lo_cyber:  ['neon_city','futuristic_city','skyscraper','rain','dark_alley','rooftop','terminal','server_room','night','underground'],

  /* ── Clothing: Fantasy/Special ── */
  cl_angel:  ['angel','angelic','white_dress','wings','halo','divine','holy','white','gold'],
  cl_demon:  ['demon','succubus','incubus','horns','tail','pointed_ears','wings','dark','red','black'],
  cl_ninja:  ['ninja','shinobi','ninja_outfit','mask','kunai','shuriken','ninja_sword','dark_clothes'],
  cl_samurai:['samurai','samurai_armor','kabuto','katana','hakama','ronin','bushido'],
  cl_sci:    ['spacesuit','astronaut','space_armor','helmet','oxygen_tank','zero_gravity_suit'],
  cl_steampunk:['steampunk','goggles','gears','brass','corset','vest','pocket_watch','mechanical','clockwork'],

  /* ── Locations: Nature ── */
  lo_beach:  ['beach','ocean','sand','coast','shore','tropical','island','palm_tree','reef','seaside','sun','wave'],
  lo_forest: ['forest','tree','woods','grove','clearing','path','moss','mushroom','stream','nature','fern','pine','spruce','oak','birch'],
  lo_mountn: ['mountain','cliff','valley','canyon','peak','hiking','altitude','panorama','ridge','summit','slope'],
  lo_river:  ['river','stream','waterfall','bridge','stone','current','bank','rapids','cascade','creek','brook'],
  lo_field:  ['field','meadow','grass','flower_field','wheat_field','wind','horizon','rural','farmland','prairie','pasture'],
  lo_garden: ['garden','flower','hedge','bench','fountain','path','botanical','rose','ivy','greenhouse','trellis'],
  lo_desert: ['desert','sand_dunes','oasis','arid','wasteland','cactus','canyon','red_rock','sahara'],
  lo_lake:   ['lake','pond','still_water','reflection','boat','dock','lakeside','ripples','mirror_lake'],
  lo_swamp:  ['swamp','marsh','wetland','bog','mangrove','misty','willow','frog'],
  lo_tundra: ['tundra','snowfield','ice','frozen','cold','arctic','wasteland','permafrost'],
  lo_jungle: ['jungle','tropical','vines','dense','exotic','parrot','monkey','ruins','humid'],
  lo_cave:   ['cave','cavern','underground','stalactite','spelunking','dark','crystal','echo'],
  lo_volcano:['volcano','lava','magma','eruption','ash','crater','fire','smoke','geothermal'],
  lo_canyon: ['canyon','gorge','ravine','cliff_wall','river_below','narrow','sheer','grand'],

  /* ── Locations: Urban ── */
  lo_city:   ['city','street','building','skyscraper','sidewalk','crosswalk','traffic','urban','downtown','metropolis','boulevard'],
  lo_alley:  ['alley','alleyway','back_alley','narrow','dark','graffiti','pipe','fire_escape','dumpster','brick_wall'],
  lo_bridge: ['bridge','overpass','viaduct','suspension_bridge','arch_bridge','stone_bridge','river_below'],
  lo_industrial:['factory','warehouse','industrial','machinery','pipe','smokestack','conveyor','steel','concrete'],
  lo_rooftop:['rooftop','skyline','night','city_lights','wind','elevated','overlooking'],
  lo_train:  ['train_station','railway','tracks','platform','train','subway','commuting','ticket_gate'],
  lo_harbor: ['harbor','port','dock','ship','crane','container','warehouse','nautical','seaside'],

  /* ── Locations: Indoor ── */
  lo_bed:    ['bedroom','bed','pillow','blanket','futon','curtain','lamp','nightstand','mirror','dresser'],
  lo_living: ['living_room','sofa','couch','coffee_table','tv','rug','bookshelf','armchair','fireplace','carpet'],
  lo_kitchen:['kitchen','cooking','stove','oven','counter','refrigerator','apron','sink','cabinets','pantry'],
  lo_bath:   ['bathroom','bathtub','shower','steam','towel','tile','mirror','bubbles','soap','toiletries'],
  lo_class:  ['classroom','desk','chalkboard','window','school','student','teacher','podium','locker'],
  lo_office: ['office','desk','computer','monitor','chair','window','skyscraper','city','cubicle','water_cooler'],
  lo_libr:   ['library','bookshelf','book','reading','quiet','lamp','glasses','study','archive','tall_shelves'],
  lo_cafe:   ['cafe','coffee','cup','table','window','pastry','cozy','warm','counter','barista'],
  lo_hospital:['hospital','clinic','nurse','doctor','bed','curtain','iv','medicine','waiting_room'],
  lo_lab:    ['laboratory','lab','beaker','test_tube','scientist','data','research','computer','equipment'],
  lo_gym:    ['gym','gymnasium','basketball_court','workout','weights','machine','mirror','training'],
  lo_church: ['church','cathedral','chapel','stained_glass','pew','altar','cross','holy','organ'],
  lo_dungeon:['dungeon','prison','cell','bars','chains','torture_chamber','dark','stone_wall'],
  lo_throne: ['throne_room','throne','royal','red_carpet','gold','guards','audience','palace'],
  lo_attic:  ['attic','dusty','boxes','old','cobweb','memories','window','roof'],
  lo_basement:['basement','cellar','dark','storage','boiler','stairs','concrete','damp'],

  /* ── Locations: Fantasy ── */
  lo_castle: ['castle','palace','fortress','throne_room','tower','drawbridge','stone_wall','moat','rampart','keep'],
  lo_ruins:  ['ruins','ancient_ruins','abandoned','overgrown','crumbling','moss','vine','derelict','lost_city'],
  lo_space:  ['space','spaceship','space_station','stars','nebula','planet','zero_gravity','cockpit','galaxy','universe'],
  lo_under:  ['underwater','deep_sea','coral_reef','ocean_floor','bubble','fish','jellyfish','kelp','sunken','abyss'],
  lo_floating:['floating_island','sky_castle','cloud','above','float','aerial','sky','heavenly'],
  lo_mirror: ['mirror_world','alternate_dimension','reverse','parallel','other_side','portal'],
  lo_dream:  ['dream_world','dream','surreal','floating','ethereal','imagination','fantasy_land'],

  /* ── Time/Weather ── */
  lo_night:  ['night','night_sky','starry_sky','midnight','dark','moonlit','late_night','moon'],
  lo_day:    ['sunny','daylight','blue_sky','clear_sky','bright','morning','afternoon','noon','sun','day'],
  lo_sunset: ['sunset','sunrise','dawn','dusk','golden_hour','twilight','magic_hour','orange_sky'],
  ev_rain:   ['rain','rainy','heavy_rain','thunderstorm','lightning','storm','drizzle','downpour','wet','thunder'],
  ev_snow:   ['snow','snowing','snowfall','blizzard','frost','ice','icicle','frozen','whiteout','hail'],
  ev_fog:    ['fog','mist','haze','morning_mist','dense_fog','obscured','ethereal','low_visibility'],
  ev_wind:   ['wind','breeze','gust','windswept','windy','blowing','gale','howling_wind'],
  lo_clouds: ['cloud','cloudy','overcast','grey_sky','storm_clouds','cumulus','cirrus'],
  lo_raining:['raining','umbrella','wet','puddle','droplets','gloomy','grey','petrichor'],

  /* ── Seasons ── */
  se_spring: ['spring','cherry_blossoms','flower_field','garden','green','bloom','petal','tulip','warmth','new_beginnings'],
  se_summer: ['summer','sunlight','hot','sun','beach','ice_cream','sunglasses','sandals','vacation','sweltering'],
  se_autumn: ['autumn','fall','autumn_leaves','maple_tree','harvest','orange_sky','golden_light','chilly','pumpkin_spice'],
  se_winter: ['winter','snow','cold','christmas','freezing','blizzard','ice','holiday','cozy','fire'],

  /* ── Events ── */
  ev_xmas:   ['christmas','christmas_tree','santa','present','gift','red','green','snow','ornament','reindeer','stocking'],
  ev_hween:  ['halloween','pumpkin','jack-o-lantern','costume','candy','ghost','bat','witch','skeleton','spooky','scary'],
  ev_vday:   ['valentine','heart','chocolate','love','couple','rose','pink','red','ribbon','candy_heart','flower'],
  ev_bday:   ['birthday','cake','candle','party','balloon','present','celebration','confetti','surprise'],
  ev_wed:    ['wedding','wedding_dress','bridal','veil','bouquet','church','ceremony','ring','white','groom','aisle'],
  ev_grad:   ['graduation','diploma','mortarboard','ceremony','school','formal','graduation_cap','commencement'],
  ev_fest:   ['festival','matsuri','fireworks','night','crowd','stall','lantern','yukata','festive','fair'],
  ev_newyr:  ['new_year','fireworks','celebration','midnight','countdown','party','champagne'],
  ev_thanks: ['thanksgiving','turkey','feast','autumn','family','dinner','harvest'],
  ev_easter: ['easter','bunny','egg','spring','chocolate','hidden','basket'],

  /* ── Lighting ── */
  li_warm:   ['warm_lighting','golden_hour','candlelight','firelight','sunset_light','orange','soft_glow','warm_hue'],
  li_cool:   ['cool_lighting','blue_hour','moonlight','cold','blue','silver','winter_light','cool_tone'],
  li_drama:  ['dramatic_lighting','chiaroscuro','backlighting','rim_lighting','silhouette','contrast','spotlight','theatrical'],
  li_soft:   ['soft_lighting','diffused','ambient','gentle','overcast','haze','foggy_light','dreamy_light'],
  li_neon:   ['neon_lights','neon','colorful_lights','purple','pink','cyan','glow','reflection','led','strip_light'],
  li_dark:   ['dark','dim','gloomy','low_lighting','shadowy','murky','tenebrous','obscured'],
  li_sun:    ['sunlight','sunbeam','sun_rays','shaft_of_light','bright','natural_light','daylight','illuminated'],
  li_moon:   ['moonlight','moonbeam','lunar','silver_light','mysterious','pale','soft_glow','night_light'],
  li_bright: ['bright','blinding','radiant','dazzling','harsh_light','overexposed','intense_light'],

  /* ── Atmosphere ── */
  at_peace:  ['peaceful','serene','tranquil','calm','quiet','gentle','relaxed','cozy','comfortable','comfy','restful'],
  at_epic:   ['epic','grand','majestic','dramatic','glorious','magnificent','heroic','legendary','awe-inspiring','grandiose'],
  at_dark:   ['dark','ominous','mysterious','eerie','foreboding','sinister','gloomy','creepy','unsettling','haunting'],
  at_romantic:['romantic','intimate','tender','loving','warm','hearts','petals','candlelight','sweet','enchanted'],
  at_action: ['dynamic','intense','powerful','fierce','explosive','impact','debris','energetic','adrenaline','thrill'],
  at_dreamy: ['dreamy','ethereal','mystical','magical','sparkle','glow','soft_focus','haze','otherworldly','surreal'],
  at_nostalg:['nostalgic','bittersweet','melancholy','wistful','sepia','vintage','old_photo','reminiscent','longing'],
  at_chaotic:['chaotic','frantic','wild','destruction','explosion','carnage','apocalyptic','pandemonium','havoc'],
  at_somber: ['somber','grave','solemn','funeral','dark','respectful','mourning','quiet'],
  at_inspire:['inspiring','uplifting','hopeful','optimistic','bright','encouraging','motivating'],
  at_mystery:['mysterious','enigmatic','puzzling','intriguing','hidden','secret','unknown'],
  at_horror: ['horror','terrifying','nightmarish','dreadful','creepy','chilling','bloodcurdling'],
  at_hygge:  ['cozy','warm','comfortable','candle','blanket','hot_drink','snug','warmth'],

  /* ── Effects ── */
  fx_petals: ['petals','falling_petals','cherry_blossom_petals','rose_petals','flower_petals','scattered_petals'],
  fx_leaves: ['falling_leaves','autumn_leaves','maple_leaves','floating_leaves'],
  fx_snow:   ['snowflakes','ice_crystals','frost_particles','snowing','snowfall'],
  fx_fire:   ['fire','flame','ember','sparks','blaze','inferno','fire_trail','burning'],
  fx_water:  ['splash','water_drop','ripple','bubble','spray','mist','steam','droplets','waves'],
  fx_spark:  ['sparkle','glitter','shimmer','twinkle','light_particles','dust_motes','shimmering','shining'],
  fx_magic:  ['magic','magic_circle','glowing','energy','aura','rune','enchanted','spell_effect','mana','glyph'],
  fx_wind:   ['wind','breeze','windswept','floating_hair','wind-blown_clothes','billowing','gust'],
  fx_smoke:  ['smoke','fog','steam','haze','exhaust','incense','mist','vapor'],
  fx_lightning:['lightning','thunder','electric','arc','zap','spark','crackle','bolt'],
  fx_blood:  ['blood','bloodstains','bleeding','gore','red','dripping','wound'],
  fx_ice:    ['ice_crystal','frost','freeze','cold_air','icy','frozen_mist','glacial'],

  /* ── Quality ── */
  q_good:    ['masterpiece','best_quality','highres','absurdres','ultra-detailed','4k','8k','high_quality','top_quality'],
  q_detail:  ['detailed_face','detailed_eyes','detailed_hands','detailed_background','beautiful','finely_detailed','intricate','elaborate'],
  q_bad:     ['worst_quality','low_quality','blurry','ugly','bad_anatomy','error','jpeg_artifacts','poorly_drawn'],
  q_cinema:  ['cinematic_lighting','film_quality','camera','lens_flare','color_grading','depth_of_field'],

  /* ── Style ── */
  st_anime:  ['anime','manga','anime_coloring','cel_shading','flat_color','line_art','illustration'],
  st_real:   ['realistic','photorealistic','photo','hyperrealistic','natural','3d_render','cg'],
  st_chibi:  ['chibi','super_deformed','cute','kawaii','simple_background','big_head','mini'],
  st_paint:  ['painting','oil_painting','watercolor','illustration','concept_art','gouache','acrylic','brushwork'],
  st_dark:   ['dark_art','gothic','noir','horror','macabre','grotesque','gloomy','shadowy'],
  st_retro:  ['retro','vintage','80s_style','90s_style','vaporwave','synthwave','pixel_art','retrowave','y2k'],
  st_pastel: ['pastel','soft_colors','muted_colors','light_palette','gentle_colors','delicate'],
  st_vibrant:['vibrant','colorful','vivid','saturated','neon','bold_colors','bright_colors','lively'],
  st_sketch: ['sketch','rough','doodle','unfinished','pencil','lined','draft'],
  st_mono:   ['monochrome','black_and_white','sepia','grayscale','single_color','desaturated'],
  st_ink:    ['ink','sumi-e','brush_stroke','calligraphy','black_ink','ink_wash'],
  st_ukiyo:  ['ukiyo-e','japanese_print','woodblock','traditional_print','hokusai'],

  /* ── Accessories ── */
  ac_glasses:['glasses','round_glasses','sunglasses','monocle','semi-rimless_eyewear','reading_glasses','spectacles','horn-rimmed_glasses'],
  ac_ribbon: ['ribbon','hair_ribbon','bow','hair_bow','neck_ribbon','wrist_ribbon','back_bow','satin_ribbon'],
  ac_flower: ['flower','hair_flower','flower_in_hair','bouquet','wreath','garland','rose','lily','corsage'],
  ac_hat:    ['hat','beret','cap','straw_hat','witch_hat','crown','tiara','mini_hat','top_hat','fedora'],
  ac_neck:   ['necklace','choker','collar','pendant','scarf','necktie','bowtie','chain_necklace','pearl_necklace'],
  ac_ear:    ['earrings','ear_piercing','stud_earrings','hoop_earrings','dangle_earrings','ear_cuff','ear_chain'],
  ac_wing:   ['wings','angel_wings','demon_wings','fairy_wings','feathered_wings','bat_wings','mechanical_wings','butterfly_wings'],
  ac_tail:   ['tail','cat_tail','fox_tail','demon_tail','wolf_tail','dragon_tail','fluffy_tail','prehensile_tail'],
  ac_ears:   ['animal_ears','cat_ears','fox_ears','rabbit_ears','dog_ears','wolf_ears','bear_ears','mouse_ears'],
  ac_halo:   ['halo','angel','angelic','divine','holy','heaven','saintly','radiant_halo'],
  ac_horn:   ['horns','demon_horns','dragon_horns','antlers','oni','devil_horns','ram_horns'],
  ac_bag:    ['bag','backpack','handbag','satchel','purse','suitcase','messenger_bag','tote_bag'],
  ac_phone:  ['phone','smartphone','cell_phone','tablet','screen','texting','selfie','calling'],
  ac_watch:  ['watch','wristwatch','pocket_watch','digital_watch','clock'],
  ac_belt:   ['belt','leather_belt','chain_belt','utility_belt','waist_belt'],
  ac_gloves: ['gloves','white_gloves','leather_gloves','fingerless_gloves','elbow_gloves','opera_gloves'],

  /* ── Animals ── */
  an_cat:    ['cat','kitten','black_cat','white_cat','calico_cat','neko','tabby_cat','siamese_cat'],
  an_dog:    ['dog','puppy','shiba_inu','golden_retriever','corgi','husky','german_shepherd','poodle'],
  an_bird:   ['bird','crow','raven','owl','eagle','sparrow','dove','hawk','seagull','hawk','pigeon'],
  an_fish:   ['fish','goldfish','koi','tropical_fish','betta_fish','shark','koi_fish'],
  an_insect: ['butterfly','moth','dragonfly','firefly','ladybug','bee','cicada','beetle'],
  an_horse:  ['horse','unicorn','pegasus','pony','stallion','mare','foal'],
  an_rabbit: ['rabbit','bunny','white_rabbit','brown_rabbit','lop-eared_rabbit'],
  an_fox:    ['fox','red_fox','fennec_fox','arctic_fox','kitsune','nine-tailed_fox'],
  an_wolf:   ['wolf','werewolf','grey_wolf','alpha_wolf','howling','pack'],
  an_snake:  ['snake','cobra','python','serpent','lamia','viper'],
  an_dragon: ['dragon','western_dragon','eastern_dragon','wyvern','drake','dragonling','hydra'],
  an_bear:   ['bear','polar_bear','brown_bear','grizzly','panda','teddy_bear'],
  an_deer:   ['deer','stag','elk','moose','reindeer','fawn'],

  /* ── Food & Drink ── */
  fd_tea:    ['tea','teacup','teapot','green_tea','black_tea','matcha','herbal_tea','afternoon_tea'],
  fd_coffee: ['coffee','latte','cappuccino','espresso','mug','cafe','americano','mocha'],
  fd_sweet:  ['cake','cupcake','cookie','donut','ice_cream','chocolate','candy','pastry','waffle','pancake','parfait'],
  fd_jpn:    ['rice','onigiri','sushi','ramen','bento','chopsticks','bowl','udon','soba','takoyaki'],
  fd_fruit:  ['apple','strawberry','cherry','orange','watermelon','grape','peach','lemon','pineapple','mango'],
  fd_alcohol:['wine','beer','sake','cocktail','champagne','glass','bottle','bar','whiskey','mojito'],
  fd_savory: ['pizza','pasta','burger','steak','sandwich','bread','soup','salad'],
  fd_breakfast:['breakfast','toast','egg','bacon','pancake','waffle','orange_juice','morning'],

  /* ── Music ── */
  mu_guitar: ['guitar','acoustic_guitar','electric_guitar','bass_guitar'],
  mu_piano:  ['piano','grand_piano','keyboard','synthesizer','organ'],
  mu_violin: ['violin','viola','cello','bow_instrument','string'],
  mu_sing:   ['microphone','singing','concert','stage','spotlight','crowd','performer','vocalist'],
  mu_drum:   ['drums','drum_kit','snare_drum','bass_drum','cymbal','tambourine'],
  mu_flute:  ['flute','recorder','piccolo','shakuhachi','ocarina'],

  /* ── Flowers ── */
  fl_cherry: ['cherry_blossoms','sakura','pink_petals','spring_breeze'],
  fl_rose:   ['rose','red_rose','white_rose','blue_rose','black_rose','thorns','bouquet_rose'],
  fl_lily:   ['lily','lotus','water_lily','white_lily','elegant','pond','lotus_flower'],
  fl_sun:    ['sunflower','daisy','yellow','bright','cheerful','summer','field'],
  fl_wist:   ['wisteria','purple','hanging','vine','elegant','garden','trellis'],
  fl_lavender:['lavender','purple','field','aromatic','calming','herb'],
  fl_tulip:  ['tulip','red','yellow','pink','garden','spring','dutch'],
  fl_orchid: ['orchid','exotic','elegant','purple','white','tropical'],

  /* ── Background ── */
  bg_simple: ['simple_background','white_background','black_background','gradient_background','abstract_background','monotone_bg'],
  bg_detail: ['detailed_background','scenery','landscape','panorama','vista','far_reaches'],
  bg_blur:   ['blurry_background','bokeh','depth_of_field','out_of_focus','soft_background'],

  /* ── Actions ── */
  act_read:  ['reading','book','open_book','studying','library','desk','bookshelf','page'],
  act_cook:  ['cooking','baking','kitchen','apron','food','spatula','pot','stove','recipe'],
  act_music: ['playing_instrument','music','concert','headphones','sheet_music','practicing'],
  act_game:  ['gaming','controller','gamepad','headset','screen','computer','mouse_keyboard','video_game'],
  act_draw:  ['drawing','painting','canvas','easel','brush','palette','art','sketching','drafting'],
  act_photo: ['camera','photographing','selfie','polaroid','posing','photoshoot','modeling'],
  act_fight: ['fighting','battle','combat','punch','kick','slash','parry','dodge','weapon','duel'],
  act_dance: ['dancing','ballet','breakdancing','spin','twirl','pirouette','waltz','tango'],
  act_swim:  ['swimming','diving','underwater','pool','water','splash','diving_board','breaststroke'],
  act_fly:   ['flying','floating','levitating','hovering','wings','wind','soaring','gliding'],
  act_climb: ['climbing','mountaineering','rock_climbing','scaling','rappelling','free_climbing'],
  act_medit: ['meditation','yoga','zen','cross-legged','eyes_closed','peaceful','breathing','mindfulness'],
  act_shop:  ['shopping','mall','store','boutique','window_shopping','bags','consumer'],
  act_walk:  ['walking','strolling','wandering','roaming','path','sidewalk','promenade'],
  act_commute:['train_station','train','bus','subway','commuting','ticket','platform','waiting'],
  act_clean: ['cleaning','broom','mop','dusting','tidying','chores','housework'],
  act_garden:['gardening','watering','planting','flowerpot','trowel','soil','garden_gloves'],
  act_write: ['writing','pen','notebook','journal','letter','author','desk','scribbling'],
  act_sleep: ['sleeping','napping','dozing','resting','laying','eyes_closed'],
  act_drink: ['drinking','sip','cup','glass','beverage','thirst'],
  act_eat:   ['eating','biting','chewing','meal','food','dining','munching'],
  act_sing:  ['singing','microphone','song','melody','karaoke','performance','voice'],
  act_run:   ['running','sprinting','jogging','racing','dashing','athletic','track'],
  act_ride:  ['riding','motorcycle','bicycle','horseback','scooter','vehicle'],
  act_sail:  ['sailing','boat','ship','deck','ocean','navigation','captain'],
};

// ═══════════════════════════════════════════════
//  RELATIONSHIPS (~900)
// ═══════════════════════════════════════════════

type Rel = [string, string, 'boost' | 'avoid' | 'conflict'];

const R: Rel[] = [
  /* ── Gender ── */
  ['girl','boy','conflict'],['multi_g','multi_b','conflict'],['girl','yaoi','conflict'],['boy','yuri','conflict'],
  ['child','mature','conflict'],['musc','child','avoid'],['musc','slim','avoid'],['slim','curvy','avoid'],
  ['chubby','musc','avoid'],['chubby','slim','avoid'],
  /* ── Hair → Eye ── */
  ['h_blonde','e_blue','boost'],['h_blonde','e_green','boost'],['h_blonde','e_purple','boost'],['h_blonde','e_brown','boost'],
  ['h_black','e_red','boost'],['h_black','e_blue','boost'],['h_black','e_brown','boost'],['h_black','e_purple','boost'],
  ['h_white','e_red','boost'],['h_white','e_purple','boost'],['h_white','e_blue','boost'],['h_white','e_grey','boost'],
  ['h_red','e_green','boost'],['h_red','e_blue','boost'],['h_red','e_brown','boost'],['h_red','e_yellow','boost'],
  ['h_blue','e_blue','boost'],['h_blue','e_red','boost'],['h_blue','e_yellow','boost'],['h_blue','e_purple','boost'],
  ['h_pink','e_blue','boost'],['h_pink','e_pink','boost'],['h_pink','e_green','boost'],['h_pink','e_purple','boost'],
  ['h_purple','e_purple','boost'],['h_purple','e_yellow','boost'],['h_purple','e_red','boost'],['h_purple','e_green','boost'],
  ['h_green','e_red','boost'],['h_green','e_green','boost'],['h_green','e_yellow','boost'],['h_green','e_brown','boost'],
  ['h_orange','e_green','boost'],['h_orange','e_brown','boost'],['h_orange','e_blue','boost'],
  ['h_brown','e_brown','boost'],['h_brown','e_blue','boost'],['h_brown','e_green','boost'],['h_brown','e_yellow','boost'],
  ['h_multi','e_hetero','boost'],

  /* ── Bald → conflicts ── */
  ['hs_bald','hs_long','conflict'],['hs_bald','hs_medium','conflict'],['hs_bald','hs_twin','conflict'],
  ['hs_bald','hs_pony','conflict'],['hs_bald','hs_braid','conflict'],['hs_bald','hs_bun','conflict'],
  ['hs_bald','hs_wavy','conflict'],['hs_bald','hs_straight','conflict'],['hs_bald','hs_bangs','conflict'],
  ['hs_bald','hs_messy','conflict'],['hs_short','hs_long','conflict'],['hs_short','hs_medium','avoid'],

  /* ── Hair style + accessories ── */
  ['hs_twin','ac_ribbon','boost'],['hs_twin','ac_flower','boost'],['hs_twin','ac_hat','avoid'],
  ['hs_pony','ac_ribbon','boost'],['hs_pony','ac_hat','boost'],
  ['hs_bun','ac_hat','boost'],['hs_bun','ac_ribbon','boost'],
  ['hs_braid','ac_flower','boost'],['hs_braid','ac_ribbon','boost'],
  ['hs_long','hs_bangs','boost'],['hs_long','ac_ribbon','boost'],['hs_long','hs_messy','boost'],
  ['hs_wavy','ac_flower','boost'],['hs_messy','hs_bangs','boost'],

  /* ── Expression conflicts ── */
  ['ex_happy','ex_sad','conflict'],['ex_happy','ex_angry','conflict'],['ex_happy','ex_pain','conflict'],
  ['ex_happy','ex_scared','avoid'],['ex_sad','ex_happy','conflict'],['ex_sad','ex_play','conflict'],
  ['ex_sad','ex_excite','conflict'],['ex_angry','ex_gentle','conflict'],['ex_angry','ex_happy','conflict'],
  ['ex_angry','ex_love','conflict'],['ex_angry','at_peace','avoid'],
  ['ex_sleepy','ex_excite','conflict'],['ex_sleepy','ex_angry','conflict'],
  ['ex_scared','ex_cool','conflict'],['ex_scared','ex_happy','avoid'],
  ['ex_embar','ex_cool','conflict'],['ex_embar','ex_serious','avoid'],['ex_embar','ex_proud','avoid'],
  ['ex_serious','ex_play','avoid'],['ex_serious','ex_happy','avoid'],
  ['ex_cool','ex_excite','avoid'],['ex_cool','ex_scared','avoid'],
  ['ex_pain','ex_gentle','conflict'],['ex_pain','ex_love','conflict'],

  /* ── Expression → Pose ── */
  ['ex_happy','p_gesture','boost'],['ex_happy','p_stand','boost'],['ex_happy','at_peace','boost'],['ex_happy','p_dynamic','boost'],
  ['ex_gentle','p_sit','boost'],['ex_gentle','at_peace','boost'],['ex_gentle','at_romantic','boost'],
  ['ex_play','p_gesture','boost'],['ex_play','act_dance','boost'],['ex_play','ex_embar','boost'],
  ['ex_excite','p_dynamic','boost'],['ex_excite','p_gesture','boost'],['ex_excite','act_dance','boost'],
  ['ex_proud','p_stand','boost'],['ex_proud','p_gesture','boost'],
  ['ex_sad','p_sit','boost'],['ex_sad','p_lie','boost'],['ex_sad','p_kneel','boost'],['ex_sad','ev_rain','boost'],
  ['ex_angry','p_stand','boost'],['ex_angry','act_fight','boost'],['ex_angry','p_dynamic','boost'],
  ['ex_scared','p_sit','boost'],['ex_scared','p_kneel','boost'],['ex_scared','p_lie','boost'],
  ['ex_embar','p_sit','boost'],['ex_embar','ex_play','avoid'],['ex_embar','p_kneel','boost'],
  ['ex_serious','p_stand','boost'],['ex_serious','act_fight','boost'],['ex_serious','act_read','boost'],
  ['ex_sleepy','p_lie','boost'],['ex_sleepy','p_sleep','boost'],['ex_sleepy','lo_bed','boost'],
  ['ex_cool','p_stand','boost'],['ex_cool','cam_pov','boost'],['ex_cool','lo_city','boost'],
  ['ex_think','p_sit','boost'],['ex_think','act_read','boost'],['ex_think','act_draw','boost'],
  ['ex_love','at_romantic','boost'],['ex_love','p_hug','boost'],['ex_love','p_kiss','boost'],
  ['ex_pain','p_lie','boost'],['ex_pain','p_kneel','boost'],

  /* ── Pose conflicts ── */
  ['p_stand','p_sit','conflict'],['p_stand','p_lie','conflict'],['p_stand','p_sleep','conflict'],
  ['p_sit','p_lie','conflict'],['p_sit','p_dynamic','conflict'],['p_sit','p_sleep','avoid'],
  ['p_lie','p_dynamic','conflict'],['p_lie','p_stand','conflict'],['p_lie','p_kneel','avoid'],
  ['p_sleep','p_dynamic','conflict'],['p_sleep','p_stand','conflict'],['p_sleep','act_fight','conflict'],
  ['p_dynamic','p_sit','conflict'],['p_dynamic','p_lie','conflict'],

  /* ── Camera conflicts ── */
  ['cam_close','cam_full','conflict'],['cam_upper','cam_full','avoid'],
  ['cam_above','cam_below','conflict'],['cam_side','cam_pov','avoid'],
  ['cam_dof','cam_close','boost'],['cam_dof','cam_upper','boost'],['cam_dof','bg_blur','boost'],
  ['cam_dyna','act_fight','boost'],['cam_dyna','p_dynamic','boost'],['cam_dyna','at_action','boost'],
  ['cam_pov','cam_behind','conflict'],['cam_pov','cam_above','conflict'],
  ['cam_close','q_detail','boost'],['cam_full','bg_detail','boost'],['cam_full','lo_castle','boost'],

  /* ── School ── */
  ['cl_school','cl_school2','boost'],['cl_school','lo_school','boost'],['cl_school','ev_school','boost'],
  ['cl_school','se_spring','boost'],['cl_school','cl_swim','conflict'],['cl_school','cl_maid','conflict'],
  ['cl_school','cl_mil','conflict'],['cl_school','cl_fantsy','conflict'],['cl_school','cl_jp','conflict'],
  ['cl_school','cl_cn','conflict'],['cl_school','cl_gothic','conflict'],['cl_school','lo_beach','avoid'],
  ['cl_school','lo_space','conflict'],['cl_school','cl_winterc','avoid'],['cl_school','cl_cyber','conflict'],
  ['ev_school','ex_happy','boost'],['ev_school','act_dance','boost'],

  /* ── Maid ── */
  ['cl_maid','cl_maid2','boost'],['cl_maid','lo_maid','boost'],['cl_maid','lo_kitchen','boost'],
  ['cl_maid','fd_tea','boost'],['cl_maid','act_clean','boost'],['cl_maid','cl_swim','conflict'],
  ['cl_maid','cl_mil','conflict'],['cl_maid','cl_fantsy','conflict'],['cl_maid','lo_beach','conflict'],
  ['cl_maid','cl_casual','conflict'],['cl_maid','cl_sporty','conflict'],['cl_maid','lo_space','conflict'],

  /* ── Military ── */
  ['cl_mil','cl_mil2','boost'],['cl_mil','lo_mil','boost'],['cl_mil','wp_gun','boost'],
  ['cl_mil','ex_serious','boost'],['cl_mil','cl_swim','conflict'],['cl_mil','cl_lolita','conflict'],
  ['cl_mil','ex_play','avoid'],['cl_mil','lo_beach','avoid'],['cl_mil','cl_dress','conflict'],
  ['cl_mil','at_peace','avoid'],['lo_mil','ev_rain','boost'],['lo_mil','lo_castle','avoid'],
  ['lo_mil','lo_beach','conflict'],['lo_mil','lo_city','avoid'],['wp_gun','act_fight','boost'],

  /* ── Fantasy ── */
  ['cl_fantsy','cl_fantsy2','boost'],['cl_fantsy','lo_fantsy','boost'],['cl_fantsy','wp_melee','boost'],
  ['cl_fantsy','mg_fantsy','boost'],['cl_fantsy','at_epic','boost'],['cl_fantsy','ex_serious','boost'],
  ['cl_fantsy','li_drama','boost'],['cl_fantsy','lo_cyber','conflict'],['cl_fantsy','cl_casual','conflict'],
  ['cl_fantsy','cl_school','conflict'],['cl_fantsy','lo_office','conflict'],['cl_fantsy','lo_city','avoid'],
  ['lo_fantsy','at_epic','boost'],['lo_fantsy','mg_fantsy','boost'],['lo_fantsy','lo_cyber','conflict'],
  ['lo_fantsy','lo_city','conflict'],['wp_melee','act_fight','boost'],['wp_melee','p_dynamic','boost'],
  ['mg_fantsy','fx_magic','boost'],['mg_fantsy','at_dreamy','boost'],['mg_fantsy','lo_castle','boost'],

  /* ── Japanese ── */
  ['cl_jp','cl_jp2','boost'],['cl_jp','lo_jp','boost'],['cl_jp','ev_jp','boost'],
  ['cl_jp','se_spring','boost'],['cl_jp','fl_cherry','boost'],['cl_jp','at_peace','boost'],
  ['cl_jp','cl_casual','conflict'],['cl_jp','cl_cyber','conflict'],['cl_jp','lo_cyber','conflict'],
  ['cl_jp','cl_school','conflict'],['cl_jp','cl_mil','conflict'],['cl_jp','cl_sporty','conflict'],
  ['lo_jp','at_peace','boost'],['lo_jp','se_autumn','boost'],['lo_jp','lo_cyber','conflict'],
  ['lo_jp','at_romantic','boost'],['ev_jp','lo_night','boost'],['ev_jp','se_summer','boost'],

  /* ── Chinese ── */
  ['cl_cn','cl_cn2','boost'],['cl_cn','lo_cn','boost'],['cl_cn','fl_lily','boost'],
  ['cl_cn','cl_casual','conflict'],['cl_cn','cl_cyber','conflict'],['cl_cn','cl_school','conflict'],
  ['cl_cn','cl_mil','conflict'],['cl_cn','cl_jp','avoid'],['cl_cn','cl_sporty','conflict'],
  ['lo_cn','at_peace','boost'],['lo_cn','lo_cyber','conflict'],

  /* ── Korean ── */
  ['cl_kr','cl_cn','avoid'],['cl_kr','cl_jp','avoid'],['cl_kr','lo_kr','boost'],

  /* ── Gothic ── */
  ['cl_gothic','at_dark','boost'],['cl_gothic','lo_night','boost'],['cl_gothic','li_dark','boost'],
  ['cl_gothic','fl_rose','boost'],['cl_gothic','h_black','boost'],['cl_gothic','e_red','boost'],
  ['cl_gothic','lo_day','avoid'],['cl_gothic','lo_beach','conflict'],['cl_gothic','se_summer','conflict'],
  ['cl_gothic','st_pastel','conflict'],['cl_gothic','ex_happy','avoid'],['cl_gothic','at_peace','avoid'],
  ['cl_gothic','st_vibrant','conflict'],['cl_gothic','lo_castle','boost'],['cl_gothic','lo_dungeon','boost'],

  /* ── Lolita ── */
  ['cl_lolita','ac_ribbon','boost'],['cl_lolita','lo_garden','boost'],['cl_lolita','lo_cafe','boost'],
  ['cl_lolita','fd_tea','boost'],['cl_lolita','fd_sweet','boost'],['cl_lolita','st_pastel','boost'],
  ['cl_lolita','se_spring','boost'],['cl_lolita','cl_mil','conflict'],['cl_lolita','cl_sporty','conflict'],
  ['cl_lolita','cl_casual','avoid'],['cl_lolita','lo_beach','avoid'],['cl_lolita','st_dark','conflict'],

  /* ── Victorian ── */
  ['cl_vict','lo_maid','boost'],['cl_vict','at_romantic','boost'],['cl_vict','cl_dress','boost'],
  ['cl_vict','cl_cyber','conflict'],['cl_vict','cl_casual','conflict'],['cl_vict','cl_sporty','conflict'],

  /* ── Witch/Pirate/Ninja/Samurai/Sci-fi/Steampunk ── */
  ['cl_witch','lo_night','boost'],['cl_witch','at_dark','boost'],['cl_witch','fx_magic','boost'],
  ['cl_witch','lo_beach','avoid'],['cl_pirate','lo_harbor','boost'],['cl_pirate','lo_beach','boost'],
  ['cl_pirate','lo_castle','avoid'],['cl_ninja','lo_night','boost'],['cl_ninja','at_dark','boost'],
  ['cl_ninja','lo_beach','avoid'],['cl_samurai','lo_jp','boost'],['cl_samurai','wp_melee','boost'],
  ['cl_samurai','cl_casual','conflict'],['cl_sci','lo_space','boost'],['cl_sci','lo_beach','conflict'],
  ['cl_sci','lo_forest','conflict'],['cl_steampunk','lo_city','boost'],['cl_steampunk','ac_glasses','boost'],
  ['cl_steampunk','lo_cyber','avoid'],['cl_demon','at_dark','boost'],['cl_demon','ac_horn','boost'],
  ['cl_demon','ac_tail','boost'],['cl_demon','lo_castle','boost'],['cl_demon','at_peace','avoid'],
  ['cl_angel','ac_wing','boost'],['cl_angel','ac_halo','boost'],['cl_angel','at_peace','boost'],
  ['cl_angel','at_dark','avoid'],['cl_angel','lo_dungeon','conflict'],

  /* ── Casual/Sporty/Formal/Dress/Swim/Under ── */
  ['cl_casual','lo_city','boost'],['cl_casual','lo_cafe','boost'],['cl_casual','act_walk','boost'],
  ['cl_casual','act_shop','boost'],['cl_casual','act_commute','boost'],['cl_casual','cl_fantsy','conflict'],
  ['cl_casual','cl_jp','conflict'],['cl_casual','cl_mil','conflict'],['cl_casual','cl_formal','avoid'],
  ['cl_sporty','p_dynamic','boost'],['cl_sporty','act_swim','boost'],['cl_sporty','lo_gym','boost'],
  ['cl_sporty','cl_formal','conflict'],['cl_sporty','cl_dress','conflict'],['cl_sporty','cl_gothic','conflict'],
  ['cl_sporty','lo_castle','avoid'],['cl_formal','lo_office','boost'],['cl_formal','lo_city','boost'],
  ['cl_formal','ac_glasses','boost'],['cl_formal','ac_bag','boost'],['cl_formal','cl_swim','conflict'],
  ['cl_formal','cl_sporty','conflict'],['cl_formal','lo_beach','conflict'],['cl_formal','cl_casual','avoid'],
  ['cl_dress','at_romantic','boost'],['cl_dress','ev_wed','boost'],['cl_dress','lo_garden','boost'],
  ['cl_dress','cl_swim','conflict'],['cl_dress','cl_sporty','conflict'],['cl_dress','lo_beach','avoid'],
  ['cl_dress','lo_gym','conflict'],['cl_swim','lo_beach','boost'],['cl_swim','se_summer','boost'],
  ['cl_swim','act_swim','boost'],['cl_swim','fx_water','boost'],['cl_swim','se_winter','conflict'],
  ['cl_swim','cl_winterc','conflict'],['cl_swim','lo_school','avoid'],['cl_swim','lo_office','conflict'],
  ['cl_swim','cl_fantsy','conflict'],['cl_under','lo_bed','boost'],['cl_under','at_romantic','boost'],
  ['cl_under','lo_beach','conflict'],['cl_under','lo_office','conflict'],['cl_under','cl_formal','avoid'],

  /* ── Winter/Rain/Cyber ── */
  ['cl_winterc','se_winter','boost'],['cl_winterc','ev_snow','boost'],['cl_winterc','li_cool','boost'],
  ['cl_winterc','cl_swim','conflict'],['cl_winterc','se_summer','conflict'],['cl_winterc','lo_beach','conflict'],
  ['cl_rain','ev_rain','boost'],['cl_rain','lo_city','boost'],['cl_rain','lo_desert','conflict'],
  ['cl_rain','se_summer','avoid'],['cl_cyber','lo_cyber','boost'],['cl_cyber','li_neon','boost'],
  ['cl_cyber','lo_night','boost'],['cl_cyber','ev_rain','boost'],['cl_cyber','lo_castle','conflict'],
  ['cl_cyber','lo_jp','conflict'],['cl_cyber','cl_jp','conflict'],['cl_cyber','cl_fantsy','conflict'],
  ['cl_cyber','lo_forest','avoid'],['cl_cyber','lo_beach','avoid'],['lo_cyber','at_dark','boost'],
  ['lo_cyber','lo_night','boost'],['lo_cyber','li_dark','boost'],

  /* ── Day/Night/Sunset vs Locations ── */
  ['lo_night','li_dark','boost'],['lo_night','li_neon','boost'],['lo_night','lo_day','conflict'],
  ['lo_night','li_day','conflict'],['lo_night','li_warm','conflict'],['lo_night','li_sun','conflict'],
  ['lo_day','li_warm','boost'],['lo_day','li_sun','boost'],['lo_day','lo_night','conflict'],
  ['lo_day','li_dark','conflict'],['lo_day','li_neon','avoid'],
  ['lo_sunset','li_warm','boost'],['lo_sunset','li_drama','boost'],['lo_sunset','at_romantic','boost'],
  ['lo_sunset','lo_night','avoid'],['lo_sunset','li_dark','avoid'],

  /* ── Weather clashes/boosts ── */
  ['ev_rain','cl_rain','boost'],['ev_rain','at_dark','boost'],['ev_rain','lo_day','conflict'],
  ['ev_rain','lo_desert','conflict'],['ev_rain','ev_snow','avoid'],['ev_rain','lo_raining','boost'],
  ['ev_snow','lo_winter','boost'],['ev_snow','cl_winterc','boost'],['ev_snow','se_winter','boost'],
  ['ev_snow','fx_snow','boost'],['ev_snow','fx_ice','boost'],['ev_snow','lo_day','avoid'],
  ['ev_snow','lo_desert','conflict'],['ev_snow','se_summer','conflict'],['ev_snow','lo_beach','conflict'],
  ['ev_fog','at_dreamy','boost'],['ev_fog','at_peace','boost'],['ev_fog','li_soft','boost'],
  ['ev_fog','lo_day','avoid'],['ev_wind','fx_wind','boost'],['ev_wind','hs_long','boost'],
  ['ev_wind','hs_messy','boost'],['ev_wind','at_action','boost'],
  /* ── Season clashes ── */
  ['se_spring','se_summer','avoid'],['se_spring','se_autumn','avoid'],['se_spring','se_winter','conflict'],
  ['se_spring','ev_snow','conflict'],['se_spring','lo_beach','avoid'],
  ['se_summer','se_winter','conflict'],['se_summer','ev_snow','conflict'],['se_summer','cl_winterc','conflict'],
  ['se_autumn','se_spring','avoid'],['se_autumn','se_winter','avoid'],
  ['se_winter','se_summer','conflict'],['se_winter','cl_swim','conflict'],['se_winter','lo_beach','conflict'],
  ['se_winter','se_spring','avoid'],

  /* ── Indoor vs Outdoor ── */
  ['lo_bed','lo_forest','conflict'],['lo_bed','lo_beach','conflict'],['lo_bed','lo_mountn','conflict'],
  ['lo_bed','lo_city','avoid'],['lo_bed','p_lie','boost'],['lo_bed','p_sleep','boost'],
  ['lo_bed','act_sleep','boost'],['lo_living','p_sit','boost'],['lo_living','act_game','boost'],
  ['lo_living','act_read','boost'],['lo_living','lo_forest','conflict'],
  ['lo_kitchen','act_cook','boost'],['lo_kitchen','act_eat','boost'],['lo_kitchen','cl_maid','boost'],
  ['lo_kitchen','lo_forest','conflict'],['lo_kitchen','lo_beach','conflict'],
  ['lo_bath','lo_forest','conflict'],['lo_bath','lo_city','conflict'],['lo_bath','lo_beach','conflict'],
  ['lo_bath','fx_water','boost'],['lo_bath','fx_steam','boost'],
  ['lo_class','lo_forest','conflict'],['lo_class','lo_beach','conflict'],['lo_class','cl_school','boost'],
  ['lo_class','ev_school','boost'],['lo_class','act_read','boost'],
  ['lo_office','lo_forest','conflict'],['lo_office','lo_beach','conflict'],['lo_office','cl_formal','boost'],
  ['lo_office','ac_glasses','boost'],['lo_office','fd_coffee','boost'],
  ['lo_libr','act_read','boost'],['lo_libr','ac_glasses','boost'],['lo_libr','at_peace','boost'],
  ['lo_libr','lo_beach','conflict'],['lo_cafe','fd_coffee','boost'],['lo_cafe','fd_sweet','boost'],
  ['lo_cafe','fd_tea','boost'],['lo_cafe','at_peace','boost'],['lo_cafe','lo_beach','avoid'],
  ['lo_hospital','cl_school','avoid'],['lo_hospital','lo_beach','conflict'],
  ['lo_lab','cl_sci','boost'],['lo_lab','ac_glasses','boost'],
  ['lo_gym','cl_sporty','boost'],['lo_gym','p_dynamic','boost'],['lo_gym','lo_beach','avoid'],
  ['lo_church','ev_wed','boost'],['lo_church','at_peace','boost'],['lo_church','at_somber','boost'],
  ['lo_church','lo_beach','conflict'],['lo_dungeon','li_dark','boost'],['lo_dungeon','at_dark','boost'],
  ['lo_dungeon','cl_gothic','boost'],['lo_dungeon','lo_beach','conflict'],['lo_dungeon','lo_cafe','conflict'],
  ['lo_throne','cl_fantsy','boost'],['lo_throne','at_epic','boost'],['lo_throne','lo_castle','boost'],
  ['lo_attic','at_nostalg','boost'],['lo_basement','at_dark','boost'],

  /* ── Outdoor coherence ── */
  ['lo_forest','li_day','boost'],['lo_forest','fx_leaves','boost'],['lo_forest','fx_wind','boost'],
  ['lo_forest','act_walk','boost'],['lo_forest','an_bird','boost'],['lo_forest','at_peace','boost'],
  ['lo_forest','lo_cyber','conflict'],['lo_mountn','li_day','boost'],['lo_mountn','at_epic','boost'],
  ['lo_mountn','act_climb','boost'],['lo_mountn','lo_beach','conflict'],
  ['lo_river','fx_water','boost'],['lo_river','at_peace','boost'],['lo_river','lo_beach','avoid'],
  ['lo_field','li_day','boost'],['lo_field','fx_wind','boost'],['lo_field','fl_sun','boost'],
  ['lo_field','act_walk','boost'],['lo_field','lo_city','avoid'],
  ['lo_garden','fl_rose','boost'],['lo_garden','fl_wist','boost'],['lo_garden','ac_flower','boost'],
  ['lo_garden','at_peace','boost'],['lo_garden','act_walk','boost'],['lo_garden','act_garden','boost'],
  ['lo_desert','ev_rain','conflict'],['lo_desert','lo_beach','avoid'],['lo_desert','lo_forest','conflict'],
  ['lo_desert','li_sun','boost'],['lo_beach','se_summer','boost'],['lo_beach','cl_swim','boost'],
  ['lo_beach','act_swim','boost'],['lo_beach','fx_water','boost'],['lo_beach','se_winter','conflict'],
  ['lo_beach','ev_snow','conflict'],['lo_beach','lo_class','conflict'],['lo_beach','lo_office','conflict'],
  ['lo_lake','at_peace','boost'],['lo_lake','lo_forest','boost'],['lo_lake','lo_beach','avoid'],
  ['lo_swamp','at_dark','boost'],['lo_swamp','ev_fog','boost'],['lo_swamp','lo_beach','avoid'],
  ['lo_tundra','se_winter','boost'],['lo_tundra','ev_snow','boost'],['lo_tundra','lo_beach','conflict'],
  ['lo_jungle','lo_beach','boost'],['lo_jungle','ev_rain','boost'],['lo_jungle','lo_city','conflict'],
  ['lo_cave','li_dark','boost'],['lo_cave','at_dark','boost'],['lo_cave','lo_beach','conflict'],
  ['lo_volcano','fx_fire','boost'],['lo_volcano','at_action','boost'],['lo_volcano','lo_beach','avoid'],
  ['lo_canyon','li_drama','boost'],['lo_canyon','at_epic','boost'],['lo_canyon','lo_city','conflict'],

  /* ── Urban ── */
  ['lo_city','at_action','boost'],['lo_city','act_walk','boost'],['lo_city','act_commute','boost'],
  ['lo_city','act_shop','boost'],['lo_city','lo_castle','conflict'],['lo_city','lo_forest','avoid'],
  ['lo_city','lo_desert','avoid'],['lo_alley','at_dark','boost'],['lo_alley','lo_night','boost'],
  ['lo_alley','li_dark','boost'],['lo_alley','lo_beach','conflict'],
  ['lo_bridge','lo_city','boost'],['lo_bridge','lo_river','boost'],['lo_bridge','lo_beach','avoid'],
  ['lo_industrial','at_dark','boost'],['lo_industrial','lo_cyber','boost'],
  ['lo_rooftop','lo_city','boost'],['lo_rooftop','lo_night','boost'],['lo_rooftop','at_peace','boost'],
  ['lo_train','lo_city','boost'],['lo_train','act_commute','boost'],['lo_train','lo_beach','avoid'],
  ['lo_harbor','lo_city','boost'],['lo_harbor','cl_pirate','boost'],['lo_harbor','lo_beach','boost'],

  /* ── Fantasy locations ── */
  ['lo_castle','cl_fantsy','boost'],['lo_castle','at_epic','boost'],['lo_castle','li_drama','boost'],
  ['lo_castle','lo_cyber','conflict'],['lo_castle','lo_city','conflict'],['lo_castle','lo_modern','conflict'],
  ['lo_ruins','at_dark','boost'],['lo_ruins','mg_fantsy','boost'],['lo_ruins','at_nostalg','boost'],
  ['lo_ruins','lo_city','conflict'],['lo_space','cl_cyber','boost'],['lo_space','lo_forest','conflict'],
  ['lo_space','lo_beach','conflict'],['lo_space','lo_city','avoid'],['lo_space','lo_under','conflict'],
  ['lo_space','lo_castle','conflict'],['lo_under','fx_water','boost'],['lo_under','an_fish','boost'],
  ['lo_under','lo_forest','conflict'],['lo_under','lo_city','conflict'],['lo_under','lo_space','conflict'],
  ['lo_under','lo_desert','conflict'],['lo_floating','lo_castle','boost'],['lo_floating','ac_wing','boost'],
  ['lo_floating','lo_city','conflict'],['lo_mirror','at_dreamy','boost'],['lo_mirror','mg_fantsy','boost'],
  ['lo_dream','at_dreamy','boost'],['lo_dream','fx_spark','boost'],

  /* ── Atmosphere ↔ Scene ── */
  ['at_peace','lo_garden','boost'],['at_peace','lo_field','boost'],['at_peace','lo_cafe','boost'],
  ['at_peace','li_soft','boost'],['at_peace','act_read','boost'],['at_peace','act_medit','boost'],
  ['at_peace','at_chaotic','conflict'],['at_peace','at_action','conflict'],['at_peace','at_dark','avoid'],
  ['at_peace','at_horror','conflict'],['at_epic','li_drama','boost'],['at_epic','at_action','boost'],
  ['at_epic','lo_castle','boost'],['at_epic','lo_mountn','boost'],['at_epic','at_peace','avoid'],
  ['at_epic','at_somber','avoid'],['at_dark','li_drama','boost'],['at_dark','lo_night','boost'],
  ['at_dark','li_dark','boost'],['at_dark','at_peace','avoid'],['at_dark','ex_happy','avoid'],
  ['at_dark','at_romantic','avoid'],['at_dark','at_hygge','conflict'],
  ['at_romantic','li_warm','boost'],['at_romantic','lo_sunset','boost'],['at_romantic','p_hug','boost'],
  ['at_romantic','p_kiss','boost'],['at_romantic','fl_rose','boost'],['at_romantic','fx_petals','boost'],
  ['at_romantic','couple','boost'],['at_romantic','at_dark','avoid'],['at_romantic','at_horror','conflict'],
  ['at_action','p_dynamic','boost'],['at_action','act_fight','boost'],['at_action','lo_city','boost'],
  ['at_action','at_peace','conflict'],['at_action','at_hygge','conflict'],
  ['at_dreamy','fx_spark','boost'],['at_dreamy','li_soft','boost'],['at_dreamy','st_pastel','boost'],
  ['at_dreamy','mg_fantsy','boost'],['at_dreamy','at_chaotic','avoid'],
  ['at_nostalg','lo_sunset','boost'],['at_nostalg','st_retro','boost'],['at_nostalg','lo_city','boost'],
  ['at_nostalg','at_action','avoid'],['at_chaotic','fx_fire','boost'],['at_chaotic','act_fight','boost'],
  ['at_chaotic','at_peace','conflict'],['at_chaotic','at_hygge','conflict'],
  ['at_somber','ev_rain','boost'],['at_somber','li_dark','boost'],['at_somber','ex_sad','boost'],
  ['at_somber','at_party','avoid'],['at_inspire','li_sun','boost'],['at_inspire','lo_field','boost'],
  ['at_inspire','at_peace','boost'],['at_mystery','li_dark','boost'],['at_mystery','at_dark','boost'],
  ['at_mystery','at_peace','avoid'],['at_horror','at_dark','boost'],['at_horror','li_dark','boost'],
  ['at_horror','at_peace','conflict'],['at_horror','at_romantic','conflict'],
  ['at_hygge','lo_bed','boost'],['at_hygge','at_peace','boost'],['at_hygge','fd_tea','boost'],
  ['at_hygge','fd_coffee','boost'],['at_hygge','at_action','conflict'],

  /* ── Effects ↔ Scene ── */
  ['fx_petals','se_spring','boost'],['fx_petals','fl_cherry','boost'],['fx_petals','lo_garden','boost'],
  ['fx_petals','at_romantic','boost'],['fx_petals','ev_snow','conflict'],['fx_petals','lo_desert','conflict'],
  ['fx_leaves','se_autumn','boost'],['fx_leaves','lo_forest','boost'],['fx_leaves','at_nostalg','boost'],
  ['fx_snow','se_winter','boost'],['fx_snow','ev_snow','boost'],['fx_snow','se_summer','conflict'],
  ['fx_snow','lo_beach','conflict'],['fx_fire','at_chaotic','boost'],['fx_fire','lo_volcano','boost'],
  ['fx_fire','fx_snow','conflict'],['fx_fire','fx_water','conflict'],['fx_fire','lo_under','conflict'],
  ['fx_water','lo_beach','boost'],['fx_water','lo_under','boost'],['fx_water','lo_river','boost'],
  ['fx_water','act_swim','boost'],['fx_water','fx_fire','conflict'],['fx_water','lo_desert','conflict'],
  ['fx_spark','at_dreamy','boost'],['fx_spark','st_pastel','boost'],['fx_spark','lo_dream','boost'],
  ['fx_magic','mg_fantsy','boost'],['fx_magic','cl_fantsy','boost'],['fx_magic','at_dreamy','boost'],
  ['fx_magic','lo_castle','boost'],['fx_magic','fx_fire','avoid'],
  ['fx_wind','hs_long','boost'],['fx_wind','hs_messy','boost'],['fx_wind','ev_wind','boost'],
  ['fx_wind','act_fly','boost'],['fx_wind','lo_field','boost'],['fx_smoke','ev_fog','boost'],
  ['fx_smoke','at_dark','boost'],['fx_smoke','lo_industrial','boost'],
  ['fx_lightning','ev_rain','boost'],['fx_lightning','at_action','boost'],['fx_lightning','at_peace','avoid'],
  ['fx_blood','at_horror','boost'],['fx_blood','act_fight','boost'],['fx_blood','at_peace','conflict'],
  ['fx_ice','se_winter','boost'],['fx_ice','lo_tundra','boost'],['fx_ice','se_summer','conflict'],

  /* ── Actions → Locations ── */
  ['act_read','lo_libr','boost'],['act_read','ac_glasses','boost'],['act_read','p_sit','boost'],
  ['act_read','at_peace','boost'],['act_read','p_dynamic','conflict'],['act_read','lo_beach','avoid'],
  ['act_cook','lo_kitchen','boost'],['act_cook','fd_jpn','boost'],['act_cook','lo_beach','conflict'],
  ['act_cook','lo_forest','avoid'],['act_music','mu_sing','boost'],['act_music','mu_guitar','boost'],
  ['act_music','mu_piano','boost'],['act_music','mu_violin','boost'],['act_music','mu_drum','boost'],
  ['act_music','mu_flute','boost'],['act_music','p_stand','boost'],
  ['act_game','lo_living','boost'],['act_game','lo_bed','boost'],['act_game','lo_forest','conflict'],
  ['act_game','lo_beach','conflict'],['act_draw','p_sit','boost'],['act_draw','act_read','avoid'],
  ['act_photo','cam_pov','boost'],['act_photo','cl_casual','boost'],
  ['act_fight','wp_melee','boost'],['act_fight','wp_gun','boost'],['act_fight','p_dynamic','boost'],
  ['act_fight','at_action','boost'],['act_fight','ex_serious','boost'],['act_fight','ex_angry','boost'],
  ['act_fight','p_sleep','conflict'],['act_fight','at_peace','conflict'],['act_fight','lo_bed','conflict'],
  ['act_dance','mu_sing','boost'],['act_dance','p_dynamic','boost'],['act_dance','p_gesture','boost'],
  ['act_dance','ev_fest','boost'],['act_dance','at_peace','avoid'],
  ['act_swim','cl_swim','boost'],['act_swim','lo_beach','boost'],['act_swim','fx_water','boost'],
  ['act_swim','se_winter','conflict'],['act_swim','lo_desert','conflict'],
  ['act_fly','ac_wing','boost'],['act_fly','fx_wind','boost'],['act_fly','lo_space','boost'],
  ['act_fly','lo_floating','boost'],['act_climb','lo_mountn','boost'],['act_climb','p_dynamic','boost'],
  ['act_climb','lo_beach','conflict'],['act_medit','at_peace','boost'],['act_medit','lo_garden','boost'],
  ['act_medit','act_fight','conflict'],['act_medit','p_dynamic','conflict'],
  ['act_shop','lo_city','boost'],['act_shop','cl_casual','boost'],['act_shop','lo_beach','avoid'],
  ['act_walk','lo_city','boost'],['act_walk','lo_field','boost'],['act_walk','lo_forest','boost'],
  ['act_walk','lo_beach','boost'],['act_walk','p_sleep','conflict'],
  ['act_commute','lo_city','boost'],['act_commute','cl_casual','boost'],['act_commute','lo_office','boost'],
  ['act_commute','lo_train','boost'],['act_commute','lo_beach','avoid'],
  ['act_clean','cl_maid','boost'],['act_clean','lo_kitchen','boost'],['act_clean','lo_beach','conflict'],
  ['act_garden','lo_garden','boost'],['act_garden','ac_flower','boost'],['act_garden','lo_beach','avoid'],
  ['act_write','p_sit','boost'],['act_write','lo_office','boost'],['act_write','act_read','boost'],
  ['act_sleep','lo_bed','boost'],['act_sleep','p_lie','boost'],['act_sleep','lo_beach','avoid'],
  ['act_drink','lo_cafe','boost'],['act_drink','fd_coffee','boost'],['act_drink','fd_tea','boost'],
  ['act_drink','fd_alcohol','boost'],['act_drink','lo_beach','avoid'],
  ['act_eat','lo_kitchen','boost'],['act_eat','lo_cafe','boost'],['act_eat','fd_jpn','boost'],
  ['act_eat','lo_beach','avoid'],['act_sing','mu_sing','boost'],['act_sing','ev_fest','boost'],
  ['act_run','p_dynamic','boost'],['act_run','lo_field','boost'],['act_run','cl_sporty','boost'],
  ['act_run','lo_beach','boost'],['act_ride','lo_city','boost'],['act_ride','act_walk','avoid'],
  ['act_sail','lo_harbor','boost'],['act_sail','lo_beach','boost'],['act_sail','lo_desert','conflict'],

  /* ── Events → Theme ── */
  ['ev_xmas','se_winter','boost'],['ev_xmas','cl_winterc','boost'],['ev_xmas','ev_snow','boost'],
  ['ev_xmas','at_hygge','boost'],['ev_xmas','se_summer','conflict'],['ev_xmas','lo_beach','conflict'],
  ['ev_hween','lo_night','boost'],['ev_hween','at_dark','boost'],['ev_hween','cl_gothic','boost'],
  ['ev_hween','cl_witch','boost'],['ev_hween','se_summer','avoid'],
  ['ev_vday','at_romantic','boost'],['ev_vday','fl_rose','boost'],['ev_vday','p_kiss','boost'],
  ['ev_vday','p_hug','boost'],['ev_vday','fd_sweet','boost'],['ev_vday','ex_love','boost'],
  ['ev_bday','fd_sweet','boost'],['ev_bday','ex_happy','boost'],['ev_bday','ev_wed','avoid'],
  ['ev_wed','cl_dress','boost'],['ev_wed','at_romantic','boost'],['ev_wed','ac_flower','boost'],
  ['ev_wed','lo_church','boost'],['ev_wed','cl_swim','conflict'],['ev_wed','cl_casual','conflict'],
  ['ev_grad','cl_school','boost'],['ev_grad','cl_formal','boost'],['ev_grad','se_spring','boost'],
  ['ev_fest','cl_jp','boost'],['ev_fest','lo_night','boost'],['ev_fest','ev_jp','boost'],
  ['ev_fest','se_summer','boost'],['ev_fest','act_dance','boost'],
  ['ev_newyr','lo_night','boost'],['ev_newyr','se_winter','boost'],['ev_newyr','lo_beach','avoid'],
  ['ev_thanks','se_autumn','boost'],['ev_thanks','at_hygge','boost'],['ev_thanks','lo_beach','avoid'],
  ['ev_easter','se_spring','boost'],['ev_easter','fl_tulip','boost'],['ev_easter','lo_beach','avoid'],

  /* ── Animal → Location ── */
  ['an_cat','lo_bed','boost'],['an_cat','lo_living','boost'],['an_cat','ac_ears','boost'],
  ['an_cat','lo_beach','avoid'],['an_dog','act_walk','boost'],['an_dog','lo_field','boost'],
  ['an_dog','lo_city','boost'],['an_dog','lo_beach','boost'],['an_bird','lo_forest','boost'],
  ['an_bird','lo_field','boost'],['an_bird','lo_beach','boost'],['an_fish','lo_under','boost'],
  ['an_fish','fx_water','boost'],['an_insect','lo_garden','boost'],['an_insect','lo_field','boost'],
  ['an_insect','lo_forest','boost'],['an_horse','lo_field','boost'],['an_horse','cl_fantsy','boost'],
  ['an_horse','lo_beach','avoid'],['an_rabbit','lo_field','boost'],['an_rabbit','lo_forest','boost'],
  ['an_fox','lo_forest','boost'],['an_fox','lo_beach','avoid'],['an_wolf','lo_forest','boost'],
  ['an_wolf','lo_beach','avoid'],['an_snake','lo_desert','boost'],['an_snake','lo_forest','boost'],
  ['an_snake','lo_beach','avoid'],['an_dragon','lo_castle','boost'],['an_dragon','lo_mountn','boost'],
  ['an_dragon','lo_beach','avoid'],['an_bear','lo_forest','boost'],['an_bear','lo_beach','avoid'],
  ['an_deer','lo_forest','boost'],['an_deer','lo_field','boost'],

  /* ── Quality ── */
  ['q_good','q_detail','boost'],['q_good','st_paint','boost'],['q_good','q_cinema','boost'],
  ['q_good','q_bad','conflict'],['q_detail','q_bad','conflict'],['q_bad','q_good','conflict'],
  ['q_cinema','li_drama','boost'],['q_cinema','cam_dyna','boost'],

  /* ── Style conflicts ── */
  ['st_anime','st_real','conflict'],['st_chibi','st_real','conflict'],
  ['st_chibi','musc','avoid'],['st_chibi','ex_serious','avoid'],['st_chibi','st_dark','avoid'],
  ['st_dark','st_pastel','conflict'],['st_dark','st_bright','conflict'],['st_dark','st_vibrant','conflict'],
  ['st_pastel','at_dark','avoid'],['st_pastel','st_dark','conflict'],['st_pastel','st_vibrant','avoid'],
  ['st_vibrant','at_dark','avoid'],['st_vibrant','st_pastel','avoid'],['st_vibrant','st_mono','conflict'],
  ['st_real','st_anime','conflict'],['st_real','st_chibi','conflict'],['st_real','st_sketch','avoid'],
  ['st_retro','lo_cyber','boost'],['st_retro','li_neon','boost'],['st_retro','st_anime','boost'],
  ['st_sketch','q_detail','boost'],['st_sketch','st_anime','boost'],
  ['st_mono','at_nostalg','boost'],['st_mono','st_dark','boost'],['st_mono','st_vibrant','conflict'],
  ['st_ink','cl_jp','boost'],['st_ink','cl_cn','boost'],['st_ink','st_real','avoid'],
  ['st_ukiyo','cl_jp','boost'],['st_ukiyo','lo_jp','boost'],['st_ukiyo','st_real','conflict'],

  /* ── Accessory coherence ── */
  ['ac_wing','act_fly','boost'],['ac_wing','ac_halo','boost'],['ac_wing','mg_fantsy','boost'],
  ['ac_wing','lo_floating','boost'],['ac_horn','at_dark','boost'],['ac_horn','cl_gothic','boost'],
  ['ac_horn','ac_halo','avoid'],['ac_horn','cl_demon','boost'],['ac_ears','ac_tail','boost'],
  ['ac_ears','an_cat','boost'],['ac_ears','an_fox','boost'],['ac_ears','ac_hat','avoid'],
  ['ac_halo','ac_horn','avoid'],['ac_halo','cl_gothic','avoid'],['ac_halo','at_dark','avoid'],
  ['ac_glasses','act_read','boost'],['ac_glasses','lo_libr','boost'],['ac_glasses','ex_serious','boost'],
  ['ac_glasses','act_fight','avoid'],['ac_glasses','act_swim','avoid'],
  ['ac_flower','lo_garden','boost'],['ac_flower','fl_rose','boost'],['ac_flower','ev_wed','boost'],
  ['ac_flower','at_romantic','boost'],['ac_hat','hs_bald','avoid'],['ac_hat','hs_bun','boost'],
  ['ac_neck','cl_formal','boost'],['ac_neck','cl_dress','boost'],
  ['ac_ear','cl_dress','boost'],['ac_ear','cl_formal','boost'],['ac_ear','ac_hat','avoid'],
  ['ac_bag','cl_casual','boost'],['ac_bag','cl_school','boost'],['ac_bag','act_shop','boost'],
  ['ac_phone','cl_cyber','boost'],['ac_phone','lo_city','boost'],
  ['ac_watch','cl_formal','boost'],['ac_gloves','cl_formal','boost'],['ac_gloves','cl_vict','boost'],
  ['ac_belt','cl_casual','boost'],['ac_belt','cl_mil','boost'],

  /* ── Flower coherence ── */
  ['fl_cherry','se_spring','boost'],['fl_cherry','cl_jp','boost'],['fl_cherry','ev_jp','boost'],
  ['fl_cherry','fx_petals','boost'],['fl_rose','at_romantic','boost'],['fl_rose','cl_gothic','boost'],
  ['fl_rose','fx_petals','boost'],['fl_rose','lo_garden','boost'],
  ['fl_lily','lo_jp','boost'],['fl_lily','lo_garden','boost'],['fl_lily','at_peace','boost'],
  ['fl_sun','se_summer','boost'],['fl_sun','lo_field','boost'],['fl_sun','ex_happy','boost'],
  ['fl_wist','cl_jp','boost'],['fl_wist','lo_garden','boost'],['fl_wist','at_romantic','boost'],
  ['fl_lavender','lo_field','boost'],['fl_lavender','at_peace','boost'],['fl_lavender','at_dreamy','boost'],
  ['fl_tulip','se_spring','boost'],['fl_tulip','lo_garden','boost'],
  ['fl_orchid','lo_cn','boost'],['fl_orchid','at_romantic','boost'],

  /* ── Background coherence ── */
  ['bg_simple','st_chibi','boost'],['bg_simple','bg_detail','conflict'],
  ['bg_detail','cam_full','boost'],['bg_detail','q_detail','boost'],['bg_detail','bg_simple','conflict'],
  ['bg_blur','cam_dof','boost'],['bg_blur','cam_close','boost'],['bg_blur','bg_detail','avoid'],

  /* ── Food & Drink ── */
  ['fd_tea','cl_jp','boost'],['fd_tea','lo_cafe','boost'],['fd_tea','cl_lolita','boost'],
  ['fd_tea','at_peace','boost'],['fd_tea','at_hygge','boost'],
  ['fd_coffee','lo_cafe','boost'],['fd_coffee','lo_office','boost'],['fd_coffee','ex_sleepy','boost'],
  ['fd_coffee','act_drink','boost'],['fd_sweet','lo_cafe','boost'],['fd_sweet','ev_bday','boost'],
  ['fd_sweet','cl_lolita','boost'],['fd_sweet','ex_happy','boost'],
  ['fd_jpn','cl_jp','boost'],['fd_jpn','act_cook','boost'],['fd_jpn','lo_kitchen','boost'],
  ['fd_jpn','act_eat','boost'],['fd_fruit','se_summer','boost'],['fd_fruit','fl_sun','boost'],
  ['fd_fruit','lo_kitchen','boost'],['fd_alcohol','lo_night','boost'],['fd_alcohol','loli','conflict'],
  ['fd_alcohol','child','conflict'],['fd_alcohol','act_drink','boost'],
  ['fd_savory','act_eat','boost'],['fd_savory','lo_kitchen','boost'],['fd_savory','lo_beach','avoid'],
  ['fd_breakfast','lo_bed','boost'],['fd_breakfast','lo_kitchen','boost'],['fd_breakfast','lo_day','boost'],
];

// ═══════════════════════════════════════════════
//  ENGINE
// ═══════════════════════════════════════════════

const tagToCluster = new Map<string, string[]>();
for (const [name, tags] of Object.entries(C)) {
  for (const t of tags) { const e = tagToCluster.get(t) || []; e.push(name); tagToCluster.set(t, e); }
}

interface Expanded { boostTags: Set<string>; avoidTags: Set<string>; conflictTags: Set<string> }
const rules = new Map<string, Expanded>();

function getOrCreate(c: string): Expanded {
  let r = rules.get(c);
  if (!r) { r = { boostTags: new Set(), avoidTags: new Set(), conflictTags: new Set() }; rules.set(c, r); }
  return r;
}

for (const [a, b, type] of R) {
  const ta = C[a] || [], tb = C[b] || [];
  const ra = getOrCreate(a), rb = getOrCreate(b);
  if (type === 'boost') { tb.forEach(t => ra.boostTags.add(t)); ta.forEach(t => rb.boostTags.add(t)); }
  else if (type === 'avoid') { tb.forEach(t => ra.avoidTags.add(t)); ta.forEach(t => rb.avoidTags.add(t)); }
  else { tb.forEach(t => ra.conflictTags.add(t)); ta.forEach(t => rb.conflictTags.add(t)); }
}

let _n = 0;
for (const [, r] of rules) _n += r.boostTags.size + r.avoidTags.size + r.conflictTags.size;
export const TOTAL_RULES = _n;

// ═══════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════

function findClusters(tag: string): string[] {
  const direct = tagToCluster.get(tag) || [];
  if (direct.length) return direct;
  const found: string[] = [];
  for (const [cn, ctags] of Object.entries(C)) {
    if (ctags.some(ct => tag.includes(ct) || ct.includes(tag))) found.push(cn);
  }
  return found;
}

export function getBoostScores(picked: string[]): Map<string, number> {
  const scores = new Map<string, number>();
  for (const tag of picked) {
    for (const cl of findClusters(tag)) {
      const r = rules.get(cl); if (!r) continue;
      for (const bt of r.boostTags) scores.set(bt, (scores.get(bt) || 0) + 3);
      for (const at of r.avoidTags) scores.set(at, (scores.get(at) || 0) - 2);
    }
  }
  return scores;
}

function buildConflictSet(picked: string[]): Set<string> {
  const blocked = new Set<string>();
  for (const tag of picked) {
    for (const cl of findClusters(tag)) {
      const r = rules.get(cl); if (!r) continue;
      for (const ct of r.conflictTags) blocked.add(ct);
    }
  }
  return blocked;
}

export function pickWeighted(tags: string[], boostScores: Map<string, number>, blacklist: Set<string>, picked: string[] = []): string | null {
  const conflictSet = buildConflictSet(picked);
  const available = tags.filter(t => {
    const tl = t.toLowerCase();
    if (blacklist.has(tl)) return false;
    if (conflictSet.has(tl)) return false;
    for (const ct of conflictSet) { if (tl.includes(ct) || ct.includes(tl)) return false; }
    return true;
  });
  if (!available.length) return null;

  const weights = available.map(tag => {
    let w = 1; const tl = tag.toLowerCase();
    for (const [pat, sc] of boostScores) { if (tl.includes(pat) || pat.includes(tl)) w += sc; }
    return Math.max(0.05, w);
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < available.length; i++) { r -= weights[i]; if (r <= 0) return available[i]; }
  return available[available.length - 1];
}
