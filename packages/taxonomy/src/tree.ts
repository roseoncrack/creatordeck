import type { NicheNode } from "@creatordeck/types";

/**
 * The complete niche taxonomy as code.
 *
 * Mirrors `niche-taxonomy.md`. Slugs are stable forever; labels and
 * descriptions are editable in the DB after seeding.
 *
 * - Roots have `level=1` (computed at seed time).
 * - Each child's `path` is `parent.path || child.slug` (computed at seed time).
 * - Aliases let brand searches like "parachuting" match `skydiving`.
 */
export const NICHE_TREE: NicheNode[] = [
  // ──────────────── Sports ────────────────
  {
    slug: "sports",
    label: "Sports",
    icon: "🏀",
    children: [
      {
        slug: "extreme_sports",
        label: "Extreme Sports",
        children: [
          { slug: "skydiving", label: "Skydiving", aliases: ["parachuting", "skydive", "freefall"] },
          { slug: "base_jumping", label: "BASE Jumping", aliases: ["base", "wingsuit_base"] },
          {
            slug: "surfing",
            label: "Surfing",
            aliases: ["surf", "surfer"],
            children: [
              { slug: "big_wave_surfing", label: "Big Wave Surfing" },
              { slug: "longboarding", label: "Longboarding" },
              { slug: "surf_lifestyle", label: "Surf Lifestyle" },
            ],
          },
          {
            slug: "motocross",
            label: "Motocross",
            aliases: ["mx", "dirt_bike", "supercross"],
            children: [
              { slug: "freestyle_motocross", label: "Freestyle Motocross", aliases: ["fmx"] },
              { slug: "enduro", label: "Enduro" },
            ],
          },
          { slug: "snowboarding", label: "Snowboarding" },
          {
            slug: "skateboarding",
            label: "Skateboarding",
            children: [
              { slug: "street_skating", label: "Street Skating" },
              { slug: "vert_skating", label: "Vert Skating" },
              { slug: "skate_culture", label: "Skate Culture" },
            ],
          },
          { slug: "bmx", label: "BMX" },
          { slug: "parkour", label: "Parkour", aliases: ["freerunning"] },
          {
            slug: "rock_climbing",
            label: "Rock Climbing",
            children: [
              { slug: "bouldering", label: "Bouldering" },
              { slug: "trad_climbing", label: "Trad Climbing" },
            ],
          },
          { slug: "mountain_biking", label: "Mountain Biking", aliases: ["mtb", "downhill"] },
          { slug: "wingsuit", label: "Wingsuit" },
          { slug: "cliff_diving", label: "Cliff Diving" },
          { slug: "kitesurfing", label: "Kitesurfing" },
        ],
      },
      {
        slug: "team_sports",
        label: "Team Sports",
        children: [
          {
            slug: "basketball",
            label: "Basketball",
            children: [
              { slug: "nba", label: "NBA" },
              { slug: "streetball", label: "Streetball" },
              { slug: "basketball_training", label: "Basketball Training" },
            ],
          },
          {
            slug: "football_us",
            label: "Football (American)",
            children: [
              { slug: "nfl", label: "NFL" },
              { slug: "flag_football", label: "Flag Football" },
            ],
          },
          {
            slug: "soccer",
            label: "Soccer / Football",
            children: [
              { slug: "premier_league", label: "Premier League" },
              { slug: "freestyle_football", label: "Freestyle Football" },
              { slug: "futsal", label: "Futsal" },
            ],
          },
          { slug: "baseball", label: "Baseball" },
          { slug: "hockey", label: "Hockey" },
          { slug: "rugby", label: "Rugby" },
          { slug: "cricket", label: "Cricket" },
          { slug: "volleyball", label: "Volleyball" },
          { slug: "lacrosse", label: "Lacrosse" },
        ],
      },
      {
        slug: "individual_sports",
        label: "Individual Sports",
        children: [
          { slug: "tennis", label: "Tennis" },
          {
            slug: "golf",
            label: "Golf",
            children: [
              { slug: "golf_instruction", label: "Golf Instruction" },
              { slug: "golf_lifestyle", label: "Golf Lifestyle" },
            ],
          },
          { slug: "boxing", label: "Boxing" },
          { slug: "mma", label: "MMA", aliases: ["ufc", "mixed_martial_arts"] },
          { slug: "wrestling", label: "Wrestling" },
          { slug: "jiu_jitsu", label: "Jiu Jitsu", aliases: ["bjj"] },
          { slug: "track_field", label: "Track & Field", aliases: ["athletics"] },
          { slug: "swimming", label: "Swimming" },
        ],
      },
      {
        slug: "fitness",
        label: "Fitness",
        children: [
          {
            slug: "strength_training",
            label: "Strength Training",
            children: [
              { slug: "powerlifting", label: "Powerlifting" },
              { slug: "bodybuilding", label: "Bodybuilding" },
              { slug: "olympic_weightlifting", label: "Olympic Weightlifting" },
              { slug: "functional_strength", label: "Functional Strength" },
            ],
          },
          { slug: "crossfit", label: "CrossFit" },
          { slug: "calisthenics", label: "Calisthenics", aliases: ["bodyweight", "street_workout"] },
          {
            slug: "yoga",
            label: "Yoga",
            children: [
              { slug: "vinyasa", label: "Vinyasa" },
              { slug: "hot_yoga", label: "Hot Yoga" },
              { slug: "yoga_lifestyle", label: "Yoga Lifestyle" },
            ],
          },
          { slug: "pilates", label: "Pilates" },
          { slug: "home_workouts", label: "Home Workouts" },
          { slug: "kettlebell", label: "Kettlebell" },
          {
            slug: "running",
            label: "Running",
            children: [
              { slug: "marathon_training", label: "Marathon Training" },
              { slug: "ultra_running", label: "Ultra Running" },
              { slug: "trail_running", label: "Trail Running" },
            ],
          },
          {
            slug: "cycling",
            label: "Cycling",
            children: [
              { slug: "road_cycling", label: "Road Cycling" },
              { slug: "gravel_cycling", label: "Gravel Cycling" },
              { slug: "indoor_cycling", label: "Indoor Cycling", aliases: ["zwift", "peloton"] },
            ],
          },
          { slug: "hiit", label: "HIIT" },
          { slug: "women_fitness", label: "Women's Fitness" },
        ],
      },
      {
        slug: "action_sports_culture",
        label: "Action Sports Culture",
        children: [
          { slug: "extreme_athlete_vlogs", label: "Extreme Athlete Vlogs" },
          { slug: "stunt_creators", label: "Stunt Creators" },
        ],
      },
    ],
  },

  // ──────────────── Gaming ────────────────
  {
    slug: "gaming",
    label: "Gaming",
    icon: "🎮",
    children: [
      {
        slug: "fps",
        label: "FPS / Shooters",
        children: [
          { slug: "fortnite", label: "Fortnite" },
          { slug: "valorant", label: "Valorant" },
          { slug: "call_of_duty", label: "Call of Duty", aliases: ["cod", "warzone", "mw"] },
          { slug: "apex_legends", label: "Apex Legends", aliases: ["apex"] },
          { slug: "counter_strike", label: "Counter-Strike", aliases: ["cs2", "csgo"] },
          { slug: "overwatch", label: "Overwatch" },
          { slug: "rainbow_six", label: "Rainbow Six", aliases: ["r6", "siege"] },
          { slug: "halo", label: "Halo" },
          { slug: "battlefield", label: "Battlefield" },
        ],
      },
      {
        slug: "battle_royale",
        label: "Battle Royale",
        children: [
          { slug: "fortnite_br", label: "Fortnite BR" },
          { slug: "pubg", label: "PUBG" },
          { slug: "warzone_br", label: "Warzone BR" },
        ],
      },
      {
        slug: "rpg",
        label: "RPG",
        children: [
          { slug: "jrpg", label: "JRPG", aliases: ["final_fantasy", "persona"] },
          { slug: "western_rpg", label: "Western RPG", aliases: ["skyrim", "fallout", "baldurs_gate"] },
          { slug: "action_rpg", label: "Action RPG", aliases: ["diablo", "path_of_exile"] },
          {
            slug: "mmorpg",
            label: "MMORPG",
            children: [
              { slug: "world_of_warcraft", label: "World of Warcraft", aliases: ["wow"] },
              { slug: "ffxiv", label: "FFXIV" },
              { slug: "runescape", label: "RuneScape" },
            ],
          },
          { slug: "soulslike", label: "Soulslike", aliases: ["dark_souls", "elden_ring"] },
        ],
      },
      {
        slug: "moba",
        label: "MOBA",
        children: [
          { slug: "league_of_legends", label: "League of Legends", aliases: ["lol"] },
          { slug: "dota_2", label: "Dota 2" },
          { slug: "smite", label: "Smite" },
        ],
      },
      {
        slug: "strategy",
        label: "Strategy",
        children: [
          { slug: "rts", label: "RTS", aliases: ["starcraft", "aoe"] },
          { slug: "4x", label: "4X", aliases: ["civilization", "stellaris"] },
          { slug: "grand_strategy", label: "Grand Strategy", aliases: ["paradox", "eu4", "hoi4"] },
          { slug: "auto_battler", label: "Auto Battler" },
        ],
      },
      {
        slug: "simulation",
        label: "Simulation",
        children: [
          { slug: "farming_sim", label: "Farming Sim", aliases: ["stardew", "farming_simulator"] },
          { slug: "life_sim", label: "Life Sim", aliases: ["sims"] },
          { slug: "city_builder", label: "City Builder", aliases: ["cities_skylines"] },
          { slug: "flight_sim", label: "Flight Sim" },
          { slug: "truck_sim", label: "Truck Sim" },
        ],
      },
      {
        slug: "sandbox",
        label: "Sandbox",
        children: [
          { slug: "minecraft", label: "Minecraft" },
          { slug: "roblox", label: "Roblox" },
          { slug: "terraria", label: "Terraria" },
          { slug: "garry_mod", label: "Garry's Mod" },
        ],
      },
      {
        slug: "horror",
        label: "Horror",
        children: [
          { slug: "survival_horror", label: "Survival Horror" },
          { slug: "psychological_horror", label: "Psychological Horror" },
          { slug: "indie_horror", label: "Indie Horror" },
        ],
      },
      {
        slug: "fighting",
        label: "Fighting",
        children: [
          { slug: "street_fighter", label: "Street Fighter" },
          { slug: "tekken", label: "Tekken" },
          { slug: "smash_bros", label: "Smash Bros" },
          { slug: "mortal_kombat", label: "Mortal Kombat" },
        ],
      },
      {
        slug: "racing_games",
        label: "Racing",
        children: [
          { slug: "sim_racing", label: "Sim Racing", aliases: ["iracing", "assetto_corsa"] },
          { slug: "arcade_racing", label: "Arcade Racing", aliases: ["forza_horizon", "mario_kart"] },
          { slug: "kart_racing", label: "Kart Racing" },
        ],
      },
      {
        slug: "sports_games",
        label: "Sports Games",
        children: [
          { slug: "fifa", label: "FIFA", aliases: ["ea_fc"] },
          { slug: "nba_2k", label: "NBA 2K" },
          { slug: "madden", label: "Madden" },
        ],
      },
      { slug: "retro_gaming", label: "Retro Gaming" },
      { slug: "speedrunning", label: "Speedrunning" },
      {
        slug: "variety_just_chatting",
        label: "Variety / Just Chatting",
        children: [
          { slug: "irl_streaming", label: "IRL Streaming" },
          { slug: "react_streaming", label: "React Streaming" },
          { slug: "podcast_streaming", label: "Podcast Streaming" },
        ],
      },
      {
        slug: "esports",
        label: "Esports",
        children: [
          { slug: "pro_player_creator", label: "Pro Player Creator" },
          { slug: "esports_caster_analyst", label: "Esports Caster / Analyst" },
          { slug: "tournament_org", label: "Tournament Org" },
        ],
      },
      {
        slug: "mobile_gaming",
        label: "Mobile Gaming",
        children: [
          { slug: "clash_royale", label: "Clash Royale" },
          { slug: "genshin_impact", label: "Genshin Impact" },
          { slug: "mobile_legends", label: "Mobile Legends" },
        ],
      },
      {
        slug: "tabletop_gaming",
        label: "Tabletop Gaming",
        children: [
          { slug: "dnd", label: "D&D", aliases: ["dungeons_and_dragons"] },
          { slug: "magic_the_gathering", label: "Magic: The Gathering", aliases: ["mtg"] },
          { slug: "board_games", label: "Board Games" },
        ],
      },
      {
        slug: "gaming_news_culture",
        label: "Gaming News & Culture",
        children: [
          { slug: "gaming_news", label: "Gaming News" },
          { slug: "gaming_drama_commentary", label: "Gaming Drama / Commentary" },
        ],
      },
    ],
  },

  // ──────────────── Food ────────────────
  {
    slug: "food",
    label: "Food",
    icon: "🍳",
    children: [
      {
        slug: "home_cooking",
        label: "Home Cooking",
        children: [
          { slug: "quick_recipes", label: "Quick Recipes" },
          { slug: "one_pot_recipes", label: "One-Pot Recipes" },
          { slug: "budget_cooking", label: "Budget Cooking" },
          { slug: "family_dinners", label: "Family Dinners" },
          { slug: "slow_cooker_instant_pot", label: "Slow Cooker / Instant Pot" },
        ],
      },
      {
        slug: "baking",
        label: "Baking",
        children: [
          {
            slug: "bread",
            label: "Bread",
            children: [
              { slug: "sourdough", label: "Sourdough" },
              { slug: "artisan_bread", label: "Artisan Bread" },
            ],
          },
          { slug: "pastry", label: "Pastry" },
          { slug: "cakes_decorating", label: "Cakes & Decorating" },
          { slug: "cookies", label: "Cookies" },
          { slug: "gluten_free_baking", label: "Gluten-Free Baking" },
        ],
      },
      {
        slug: "restaurant_reviews",
        label: "Restaurant Reviews",
        children: [
          { slug: "fine_dining", label: "Fine Dining" },
          { slug: "street_food", label: "Street Food" },
          { slug: "hidden_gems", label: "Hidden Gems" },
          { slug: "chain_reviews", label: "Chain Reviews", aliases: ["fast_food_reviews"] },
          { slug: "international_food_tours", label: "International Food Tours" },
        ],
      },
      {
        slug: "mukbang",
        label: "Mukbang",
        aliases: ["eating_show"],
        children: [
          { slug: "spicy_mukbang", label: "Spicy Mukbang" },
          { slug: "seafood_mukbang", label: "Seafood Mukbang" },
        ],
      },
      {
        slug: "meal_prep",
        label: "Meal Prep",
        children: [
          { slug: "high_protein_meal_prep", label: "High Protein Meal Prep" },
          { slug: "budget_meal_prep", label: "Budget Meal Prep" },
          { slug: "weight_loss_meal_prep", label: "Weight Loss Meal Prep" },
        ],
      },
      {
        slug: "cuisines",
        label: "Cuisines",
        children: [
          { slug: "italian", label: "Italian" },
          { slug: "mexican", label: "Mexican" },
          {
            slug: "japanese",
            label: "Japanese",
            children: [
              { slug: "sushi", label: "Sushi" },
              { slug: "ramen", label: "Ramen" },
            ],
          },
          { slug: "chinese", label: "Chinese" },
          { slug: "indian", label: "Indian" },
          { slug: "thai", label: "Thai" },
          { slug: "korean", label: "Korean" },
          { slug: "french", label: "French" },
          { slug: "middle_eastern", label: "Middle Eastern" },
          { slug: "soul_food", label: "Soul Food" },
          { slug: "caribbean", label: "Caribbean" },
        ],
      },
      {
        slug: "diets",
        label: "Diets",
        children: [
          { slug: "vegan", label: "Vegan" },
          { slug: "vegetarian", label: "Vegetarian" },
          { slug: "keto", label: "Keto" },
          { slug: "carnivore", label: "Carnivore" },
          { slug: "paleo", label: "Paleo" },
          { slug: "whole30", label: "Whole30" },
          { slug: "gluten_free", label: "Gluten-Free" },
          { slug: "halal", label: "Halal" },
        ],
      },
      {
        slug: "grilling_bbq",
        label: "Grilling & BBQ",
        children: [
          { slug: "smoking", label: "Smoking" },
          { slug: "steak", label: "Steak" },
          { slug: "tailgating", label: "Tailgating" },
        ],
      },
      {
        slug: "beverages",
        label: "Beverages",
        children: [
          {
            slug: "coffee",
            label: "Coffee",
            children: [
              { slug: "specialty_coffee", label: "Specialty Coffee" },
              { slug: "home_barista", label: "Home Barista" },
            ],
          },
          { slug: "tea", label: "Tea" },
          { slug: "cocktails", label: "Cocktails", aliases: ["mixology"] },
          { slug: "wine", label: "Wine" },
          { slug: "craft_beer", label: "Craft Beer" },
          { slug: "kombucha_fermentation", label: "Kombucha & Fermentation" },
        ],
      },
      { slug: "food_science", label: "Food Science" },
      { slug: "viral_food_trends", label: "Viral Food Trends" },
    ],
  },

  // ──────────────── Lifestyle ────────────────
  {
    slug: "lifestyle",
    label: "Lifestyle",
    icon: "✨",
    children: [
      {
        slug: "travel",
        label: "Travel",
        children: [
          { slug: "budget_travel", label: "Budget Travel" },
          { slug: "luxury_travel", label: "Luxury Travel" },
          { slug: "solo_travel", label: "Solo Travel" },
          { slug: "couples_travel", label: "Couples Travel" },
          { slug: "family_travel", label: "Family Travel" },
          { slug: "van_life", label: "Van Life", aliases: ["vanlife", "rv_life"] },
          { slug: "digital_nomad", label: "Digital Nomad" },
          { slug: "adventure_travel", label: "Adventure Travel" },
          { slug: "cruise_travel", label: "Cruise Travel" },
          { slug: "travel_hacks_points", label: "Travel Hacks & Points", aliases: ["points_miles", "credit_card_hacks"] },
          {
            slug: "regional",
            label: "Regional",
            children: [
              { slug: "travel_europe", label: "Travel Europe" },
              { slug: "travel_asia", label: "Travel Asia" },
              { slug: "travel_americas", label: "Travel Americas" },
              { slug: "travel_africa", label: "Travel Africa" },
            ],
          },
        ],
      },
      {
        slug: "fashion",
        label: "Fashion",
        children: [
          { slug: "streetwear", label: "Streetwear" },
          { slug: "high_fashion", label: "High Fashion", aliases: ["luxury_fashion", "runway"] },
          { slug: "thrifting", label: "Thrifting", aliases: ["vintage_fashion"] },
          {
            slug: "menswear",
            label: "Menswear",
            children: [
              { slug: "classic_menswear", label: "Classic Menswear" },
              { slug: "techwear", label: "Techwear" },
            ],
          },
          { slug: "womenswear", label: "Womenswear" },
          { slug: "modest_fashion", label: "Modest Fashion" },
          { slug: "plus_size_fashion", label: "Plus Size Fashion" },
          { slug: "sneakerheads", label: "Sneakerheads" },
          { slug: "outfit_inspo", label: "Outfit Inspo", aliases: ["ootd", "get_ready_with_me"] },
          { slug: "sustainable_fashion", label: "Sustainable Fashion" },
        ],
      },
      {
        slug: "beauty",
        label: "Beauty",
        children: [
          {
            slug: "makeup",
            label: "Makeup",
            children: [
              { slug: "everyday_makeup", label: "Everyday Makeup" },
              { slug: "glam_makeup", label: "Glam Makeup" },
              { slug: "sfx_makeup", label: "SFX Makeup", aliases: ["special_effects_makeup"] },
            ],
          },
          {
            slug: "skincare",
            label: "Skincare",
            children: [
              { slug: "k_beauty", label: "K-Beauty", aliases: ["korean_skincare"] },
              { slug: "anti_aging", label: "Anti-Aging" },
              { slug: "acne_focused", label: "Acne-Focused" },
            ],
          },
          {
            slug: "hair",
            label: "Hair",
            children: [
              { slug: "hair_styling", label: "Hair Styling" },
              { slug: "natural_hair", label: "Natural Hair" },
              { slug: "hair_color", label: "Hair Color" },
              { slug: "balding_mens_hair", label: "Balding / Men's Hair" },
            ],
          },
          { slug: "nails", label: "Nails" },
          { slug: "fragrance", label: "Fragrance" },
          { slug: "grooming_men", label: "Grooming (Men)" },
        ],
      },
      {
        slug: "vlogging",
        label: "Vlogging",
        children: [
          { slug: "daily_vlog", label: "Daily Vlog" },
          { slug: "couples_vlog", label: "Couples Vlog" },
          { slug: "morning_routine_vlog", label: "Morning Routine Vlog" },
          { slug: "productivity_vlog", label: "Productivity Vlog" },
          { slug: "aesthetic_vlog", label: "Aesthetic Vlog" },
        ],
      },
      {
        slug: "home",
        label: "Home",
        children: [
          { slug: "interior_design", label: "Interior Design" },
          { slug: "home_renovation_diy", label: "Home Renovation / DIY", aliases: ["diy_home"] },
          { slug: "apartment_living", label: "Apartment Living" },
          { slug: "small_space_living", label: "Small Space Living" },
          {
            slug: "cleaning_organization",
            label: "Cleaning & Organization",
            children: [
              { slug: "decluttering", label: "Decluttering" },
              { slug: "cleanfluencer", label: "Cleanfluencer" },
            ],
          },
          { slug: "home_decor", label: "Home Decor" },
          { slug: "plants_houseplants", label: "Plants & Houseplants" },
        ],
      },
      {
        slug: "self_improvement",
        label: "Self-Improvement",
        children: [
          { slug: "productivity", label: "Productivity" },
          { slug: "habits", label: "Habits" },
          { slug: "stoicism_philosophy", label: "Stoicism & Philosophy" },
          { slug: "morning_routines", label: "Morning Routines" },
        ],
      },
      {
        slug: "dating_relationships",
        label: "Dating & Relationships",
        children: [
          { slug: "dating_advice", label: "Dating Advice" },
          { slug: "relationship_content", label: "Relationship Content" },
          { slug: "couples_content", label: "Couples Content" },
        ],
      },
    ],
  },

  // ──────────────── Tech ────────────────
  {
    slug: "tech",
    label: "Tech",
    icon: "💻",
    children: [
      {
        slug: "reviews",
        label: "Reviews",
        children: [
          { slug: "smartphone_reviews", label: "Smartphone Reviews" },
          { slug: "laptop_reviews", label: "Laptop Reviews" },
          { slug: "pc_components", label: "PC Components", aliases: ["pc_building"] },
          { slug: "audio_gear", label: "Audio Gear", aliases: ["headphones", "speakers"] },
          { slug: "camera_gear", label: "Camera Gear" },
          { slug: "smart_home", label: "Smart Home" },
          { slug: "ev_tech", label: "EV Tech", aliases: ["tesla", "electric_vehicles_tech"] },
          { slug: "wearables", label: "Wearables", aliases: ["smartwatch", "apple_watch"] },
          { slug: "gadget_unboxings", label: "Gadget Unboxings" },
        ],
      },
      {
        slug: "tutorials",
        label: "Tutorials",
        children: [
          {
            slug: "coding_tutorials",
            label: "Coding Tutorials",
            children: [
              {
                slug: "web_dev",
                label: "Web Dev",
                children: [
                  { slug: "react", label: "React" },
                  { slug: "nextjs", label: "Next.js" },
                  { slug: "vue", label: "Vue" },
                ],
              },
              { slug: "python", label: "Python" },
              {
                slug: "mobile_dev",
                label: "Mobile Dev",
                children: [
                  { slug: "ios_dev", label: "iOS Dev" },
                  { slug: "android_dev", label: "Android Dev" },
                ],
              },
              {
                slug: "game_dev",
                label: "Game Dev",
                children: [
                  { slug: "unity", label: "Unity" },
                  { slug: "unreal", label: "Unreal" },
                ],
              },
              { slug: "devops", label: "DevOps" },
            ],
          },
          { slug: "tech_how_to", label: "Tech How-To" },
          { slug: "productivity_apps", label: "Productivity Apps" },
          { slug: "workflow_setups", label: "Workflow Setups", aliases: ["desk_setup", "battlestation"] },
        ],
      },
      {
        slug: "ai_software",
        label: "AI & Software",
        children: [
          { slug: "ai_news_commentary", label: "AI News & Commentary" },
          { slug: "llm_tools", label: "LLM Tools", aliases: ["chatgpt", "claude_ai_creator"] },
          {
            slug: "ai_art",
            label: "AI Art",
            children: [
              { slug: "midjourney", label: "Midjourney" },
              { slug: "stable_diffusion", label: "Stable Diffusion" },
            ],
          },
          { slug: "prompt_engineering", label: "Prompt Engineering" },
          { slug: "ai_for_business", label: "AI for Business" },
          { slug: "saas_reviews", label: "SaaS Reviews" },
          { slug: "no_code", label: "No-Code", aliases: ["bubble", "webflow", "zapier"] },
        ],
      },
      {
        slug: "cybersecurity",
        label: "Cybersecurity",
        children: [
          { slug: "ethical_hacking", label: "Ethical Hacking" },
          { slug: "osint", label: "OSINT" },
          { slug: "privacy_advocacy", label: "Privacy Advocacy" },
        ],
      },
      { slug: "enterprise_tech", label: "Enterprise Tech" },
      {
        slug: "tech_news_commentary",
        label: "Tech News & Commentary",
        children: [
          { slug: "tech_drama", label: "Tech Drama" },
          { slug: "startup_news", label: "Startup News" },
        ],
      },
    ],
  },

  // ──────────────── Finance ────────────────
  {
    slug: "finance",
    label: "Finance",
    icon: "💰",
    children: [
      {
        slug: "investing",
        label: "Investing",
        children: [
          {
            slug: "stocks",
            label: "Stocks",
            children: [
              { slug: "value_investing", label: "Value Investing" },
              { slug: "growth_investing", label: "Growth Investing" },
              { slug: "dividend_investing", label: "Dividend Investing" },
            ],
          },
          { slug: "etfs_index_funds", label: "ETFs & Index Funds" },
          { slug: "options_trading", label: "Options Trading" },
          { slug: "day_trading", label: "Day Trading" },
          { slug: "swing_trading", label: "Swing Trading" },
          { slug: "futures_trading", label: "Futures Trading" },
          {
            slug: "real_estate_investing",
            label: "Real Estate Investing",
            children: [
              { slug: "rental_properties", label: "Rental Properties" },
              { slug: "reits", label: "REITs" },
              { slug: "house_hacking", label: "House Hacking" },
            ],
          },
          { slug: "private_equity_vc", label: "Private Equity / VC" },
          { slug: "alternative_investments", label: "Alternative Investments" },
        ],
      },
      {
        slug: "crypto",
        label: "Crypto",
        children: [
          { slug: "bitcoin", label: "Bitcoin" },
          { slug: "ethereum", label: "Ethereum" },
          { slug: "altcoins", label: "Altcoins" },
          { slug: "defi", label: "DeFi" },
          { slug: "nfts", label: "NFTs" },
          { slug: "crypto_news", label: "Crypto News" },
          {
            slug: "crypto_trading",
            label: "Crypto Trading",
            children: [
              { slug: "crypto_day_trading", label: "Crypto Day Trading" },
              { slug: "crypto_ta", label: "Crypto TA", aliases: ["technical_analysis_crypto"] },
            ],
          },
          { slug: "on_chain_analysis", label: "On-Chain Analysis" },
          { slug: "solana_ecosystem", label: "Solana Ecosystem" },
        ],
      },
      {
        slug: "personal_finance",
        label: "Personal Finance",
        children: [
          { slug: "budgeting", label: "Budgeting" },
          { slug: "debt_payoff", label: "Debt Payoff" },
          { slug: "saving_strategies", label: "Saving Strategies" },
          { slug: "credit_cards_rewards", label: "Credit Cards & Rewards" },
          { slug: "side_hustles", label: "Side Hustles" },
          { slug: "financial_independence", label: "Financial Independence", aliases: ["fire", "fi_re"] },
          { slug: "tax_strategy", label: "Tax Strategy" },
        ],
      },
      {
        slug: "entrepreneurship_finance",
        label: "Entrepreneurship Finance",
        children: [
          { slug: "small_business_finance", label: "Small Business Finance" },
          { slug: "ecommerce_finance", label: "Ecommerce Finance" },
        ],
      },
      {
        slug: "macro_economics",
        label: "Macro & Economics",
        children: [
          { slug: "markets_news", label: "Markets News" },
          { slug: "recession_inflation_commentary", label: "Recession & Inflation Commentary" },
        ],
      },
    ],
  },

  // ──────────────── Health & Wellness ────────────────
  {
    slug: "health_wellness",
    label: "Health & Wellness",
    icon: "🧘",
    children: [
      {
        slug: "mental_health",
        label: "Mental Health",
        children: [
          { slug: "anxiety_depression", label: "Anxiety & Depression" },
          { slug: "adhd_neurodivergent", label: "ADHD & Neurodivergent" },
          { slug: "therapy_education", label: "Therapy Education", aliases: ["therapist_creators"] },
          { slug: "meditation_mindfulness", label: "Meditation & Mindfulness" },
          { slug: "trauma_recovery", label: "Trauma Recovery" },
          { slug: "mens_mental_health", label: "Men's Mental Health" },
        ],
      },
      {
        slug: "nutrition",
        label: "Nutrition",
        children: [
          { slug: "macros_tracking", label: "Macros Tracking" },
          { slug: "intuitive_eating", label: "Intuitive Eating" },
          { slug: "sports_nutrition", label: "Sports Nutrition" },
          { slug: "supplements", label: "Supplements" },
          { slug: "gut_health", label: "Gut Health" },
          { slug: "intermittent_fasting", label: "Intermittent Fasting" },
          { slug: "plant_based_nutrition", label: "Plant-Based Nutrition" },
        ],
      },
      {
        slug: "fitness_wellness",
        label: "Fitness (Wellness Focus)",
        children: [
          { slug: "functional_fitness", label: "Functional Fitness" },
          { slug: "recovery_mobility", label: "Recovery & Mobility", aliases: ["stretching", "mobility_work"] },
          { slug: "biohacking", label: "Biohacking" },
          { slug: "cold_plunge_sauna", label: "Cold Plunge & Sauna" },
          { slug: "breathwork", label: "Breathwork" },
        ],
      },
      { slug: "sleep", label: "Sleep" },
      { slug: "chronic_illness_advocacy", label: "Chronic Illness Advocacy" },
      {
        slug: "womens_health",
        label: "Women's Health",
        children: [
          { slug: "hormone_health", label: "Hormone Health" },
          { slug: "pregnancy_postpartum", label: "Pregnancy & Postpartum" },
          { slug: "menopause", label: "Menopause" },
          { slug: "pcos", label: "PCOS" },
        ],
      },
      {
        slug: "mens_health",
        label: "Men's Health",
        children: [
          { slug: "trt_hrt", label: "TRT / HRT" },
          { slug: "prostate_health", label: "Prostate Health" },
        ],
      },
      {
        slug: "alternative_medicine",
        label: "Alternative Medicine",
        children: [
          { slug: "acupuncture_tcm", label: "Acupuncture & TCM" },
          { slug: "ayurveda", label: "Ayurveda" },
          { slug: "functional_medicine", label: "Functional Medicine" },
        ],
      },
      {
        slug: "medical_educators",
        label: "Medical Educators",
        aliases: ["med_school", "doctor_creators"],
        children: [
          { slug: "doctor_creators", label: "Doctor Creators" },
          { slug: "nurse_creators", label: "Nurse Creators" },
          { slug: "pharmacist_creators", label: "Pharmacist Creators" },
        ],
      },
    ],
  },

  // ──────────────── Entertainment ────────────────
  {
    slug: "entertainment",
    label: "Entertainment",
    icon: "🎭",
    children: [
      {
        slug: "comedy",
        label: "Comedy",
        children: [
          { slug: "stand_up", label: "Stand-Up" },
          { slug: "sketch_comedy", label: "Sketch Comedy" },
          { slug: "improv", label: "Improv" },
          { slug: "parody", label: "Parody" },
          { slug: "meme_creators", label: "Meme Creators" },
          { slug: "prank_content", label: "Prank Content" },
        ],
      },
      {
        slug: "storytelling",
        label: "Storytelling",
        children: [
          { slug: "true_crime", label: "True Crime" },
          { slug: "conspiracy_theories", label: "Conspiracy Theories" },
          { slug: "horror_stories", label: "Horror Stories" },
          { slug: "personal_stories", label: "Personal Stories", aliases: ["storytime"] },
          { slug: "historical_storytelling", label: "Historical Storytelling" },
        ],
      },
      {
        slug: "reaction",
        label: "Reaction",
        children: [
          { slug: "music_reaction", label: "Music Reaction" },
          { slug: "movie_tv_reaction", label: "Movie & TV Reaction" },
          { slug: "sports_reaction", label: "Sports Reaction" },
          { slug: "viral_video_reaction", label: "Viral Video Reaction" },
        ],
      },
      {
        slug: "film_tv",
        label: "Film & TV",
        children: [
          { slug: "movie_reviews", label: "Movie Reviews" },
          { slug: "tv_recap", label: "TV Recap", aliases: ["show_breakdowns"] },
          { slug: "film_analysis", label: "Film Analysis", aliases: ["video_essay_film"] },
          { slug: "anime_reviews", label: "Anime Reviews" },
          { slug: "film_industry_news", label: "Film Industry News" },
        ],
      },
      {
        slug: "celebrity_pop_culture",
        label: "Celebrity & Pop Culture",
        children: [
          { slug: "celebrity_news", label: "Celebrity News" },
          { slug: "reality_tv_commentary", label: "Reality TV Commentary" },
          { slug: "stan_culture", label: "Stan Culture" },
        ],
      },
      { slug: "theater_performing_arts", label: "Theater & Performing Arts" },
      {
        slug: "podcasts",
        label: "Podcasts",
        children: [
          { slug: "interview_podcasts", label: "Interview Podcasts" },
          { slug: "true_crime_podcasts", label: "True Crime Podcasts" },
          { slug: "comedy_podcasts", label: "Comedy Podcasts" },
        ],
      },
    ],
  },

  // ──────────────── Education ────────────────
  {
    slug: "education",
    label: "Education",
    icon: "📚",
    children: [
      {
        slug: "stem",
        label: "STEM",
        children: [
          { slug: "physics", label: "Physics" },
          { slug: "chemistry", label: "Chemistry" },
          { slug: "biology", label: "Biology" },
          { slug: "mathematics", label: "Mathematics" },
          { slug: "space_astronomy", label: "Space & Astronomy" },
        ],
      },
      {
        slug: "history",
        label: "History",
        children: [
          { slug: "ancient_history", label: "Ancient History" },
          { slug: "modern_history", label: "Modern History" },
          { slug: "military_history", label: "Military History" },
        ],
      },
      {
        slug: "languages",
        label: "Languages",
        children: [
          { slug: "language_learning", label: "Language Learning" },
          { slug: "linguistics", label: "Linguistics" },
        ],
      },
      { slug: "academic_help", label: "Academic Help", aliases: ["study_with_me", "study_tips"] },
      { slug: "how_things_work", label: "How Things Work" },
      { slug: "critical_thinking_logic", label: "Critical Thinking & Logic" },
    ],
  },

  // ──────────────── Arts & Crafts ────────────────
  {
    slug: "arts_crafts",
    label: "Arts & Crafts",
    icon: "🎨",
    children: [
      {
        slug: "visual_art",
        label: "Visual Art",
        children: [
          { slug: "digital_art", label: "Digital Art" },
          { slug: "traditional_painting", label: "Traditional Painting" },
          { slug: "illustration", label: "Illustration" },
          { slug: "concept_art", label: "Concept Art" },
        ],
      },
      {
        slug: "photography",
        label: "Photography",
        children: [
          { slug: "portrait_photography", label: "Portrait Photography" },
          { slug: "landscape_photography", label: "Landscape Photography" },
          { slug: "street_photography", label: "Street Photography" },
          { slug: "film_photography", label: "Film Photography" },
        ],
      },
      {
        slug: "filmmaking",
        label: "Filmmaking",
        children: [
          { slug: "cinematography", label: "Cinematography" },
          { slug: "video_editing", label: "Video Editing" },
          { slug: "short_films", label: "Short Films" },
        ],
      },
      {
        slug: "crafts",
        label: "Crafts",
        children: [
          { slug: "knitting_crochet", label: "Knitting & Crochet" },
          { slug: "woodworking", label: "Woodworking" },
          { slug: "pottery_ceramics", label: "Pottery & Ceramics" },
          { slug: "leatherworking", label: "Leatherworking" },
          { slug: "jewelry_making", label: "Jewelry Making" },
          { slug: "papercraft_origami", label: "Papercraft & Origami" },
        ],
      },
      {
        slug: "writing",
        label: "Writing",
        children: [
          { slug: "creative_writing", label: "Creative Writing" },
          { slug: "screenwriting", label: "Screenwriting" },
          { slug: "poetry", label: "Poetry" },
        ],
      },
      { slug: "3d_printing", label: "3D Printing" },
    ],
  },

  // ──────────────── Automotive ────────────────
  {
    slug: "automotive",
    label: "Automotive",
    icon: "🚗",
    children: [
      {
        slug: "car_reviews",
        label: "Car Reviews",
        children: [
          { slug: "sports_cars", label: "Sports Cars" },
          { slug: "luxury_cars", label: "Luxury Cars" },
          { slug: "trucks_suvs", label: "Trucks & SUVs" },
          { slug: "jdm", label: "JDM" },
        ],
      },
      {
        slug: "ev",
        label: "Electric Vehicles",
        children: [
          { slug: "tesla", label: "Tesla" },
          { slug: "rivian", label: "Rivian" },
          { slug: "ev_charging_news", label: "EV & Charging News" },
        ],
      },
      {
        slug: "car_culture",
        label: "Car Culture",
        children: [
          { slug: "stance_modifications", label: "Stance & Modifications" },
          { slug: "drift", label: "Drift" },
          { slug: "overlanding", label: "Overlanding" },
          { slug: "classic_cars", label: "Classic Cars" },
        ],
      },
      {
        slug: "motorcycles",
        label: "Motorcycles",
        children: [
          { slug: "sport_bikes", label: "Sport Bikes" },
          { slug: "cruisers", label: "Cruisers" },
          { slug: "adventure_motorcycles", label: "Adventure Motorcycles", aliases: ["adv_riding"] },
        ],
      },
      { slug: "diy_car_repair", label: "DIY Car Repair" },
      { slug: "auto_industry_news", label: "Auto Industry News" },
    ],
  },

  // ──────────────── Outdoors ────────────────
  {
    slug: "outdoors",
    label: "Outdoors",
    icon: "🏕️",
    children: [
      {
        slug: "camping",
        label: "Camping",
        children: [
          { slug: "car_camping", label: "Car Camping" },
          { slug: "overlanding_outdoors", label: "Overlanding (Outdoors)" },
          { slug: "ultralight_camping", label: "Ultralight Camping" },
        ],
      },
      {
        slug: "hiking",
        label: "Hiking",
        children: [
          { slug: "thru_hiking", label: "Thru-Hiking", aliases: ["pct", "at", "cdt"] },
          { slug: "day_hiking", label: "Day Hiking" },
          { slug: "international_trekking", label: "International Trekking" },
        ],
      },
      {
        slug: "hunting",
        label: "Hunting",
        children: [
          { slug: "bow_hunting", label: "Bow Hunting" },
          { slug: "rifle_hunting", label: "Rifle Hunting" },
        ],
      },
      {
        slug: "fishing",
        label: "Fishing",
        children: [
          { slug: "fly_fishing", label: "Fly Fishing" },
          { slug: "bass_fishing", label: "Bass Fishing" },
          { slug: "deep_sea_fishing", label: "Deep Sea Fishing" },
        ],
      },
      { slug: "bushcraft_survival", label: "Bushcraft & Survival" },
      { slug: "kayaking_canoeing", label: "Kayaking & Canoeing" },
      { slug: "gear_reviews_outdoors", label: "Gear Reviews (Outdoors)" },
    ],
  },

  // ──────────────── Pets & Animals ────────────────
  {
    slug: "pets_animals",
    label: "Pets & Animals",
    icon: "🐕",
    children: [
      {
        slug: "dogs",
        label: "Dogs",
        children: [
          { slug: "dog_training", label: "Dog Training" },
          { slug: "dog_breeds", label: "Dog Breeds" },
          { slug: "dog_lifestyle", label: "Dog Lifestyle" },
        ],
      },
      {
        slug: "cats",
        label: "Cats",
        children: [
          { slug: "cat_care", label: "Cat Care" },
          { slug: "cat_humor", label: "Cat Humor" },
        ],
      },
      {
        slug: "exotic_pets",
        label: "Exotic Pets",
        children: [
          { slug: "reptiles", label: "Reptiles" },
          { slug: "birds", label: "Birds" },
        ],
      },
      { slug: "wildlife_education", label: "Wildlife Education" },
      { slug: "farm_animals_homestead", label: "Farm Animals & Homestead" },
      { slug: "animal_rescue_advocacy", label: "Animal Rescue & Advocacy" },
    ],
  },

  // ──────────────── Parenting & Family ────────────────
  {
    slug: "parenting_family",
    label: "Parenting & Family",
    icon: "👶",
    children: [
      {
        slug: "new_parents",
        label: "New Parents",
        children: [
          { slug: "pregnancy_content", label: "Pregnancy Content" },
          { slug: "newborn_care", label: "Newborn Care" },
          { slug: "postpartum_recovery", label: "Postpartum Recovery" },
        ],
      },
      { slug: "toddler_parenting", label: "Toddler Parenting" },
      { slug: "school_age_parenting", label: "School-Age Parenting" },
      { slug: "teen_parenting", label: "Teen Parenting" },
      { slug: "homeschool", label: "Homeschool" },
      { slug: "special_needs_parenting", label: "Special Needs Parenting" },
      { slug: "single_parents", label: "Single Parents" },
      { slug: "family_vlogs", label: "Family Vlogs" },
    ],
  },

  // ──────────────── Business & Career ────────────────
  {
    slug: "business",
    label: "Business & Career",
    icon: "💼",
    children: [
      {
        slug: "entrepreneurship",
        label: "Entrepreneurship",
        children: [
          { slug: "solopreneur", label: "Solopreneur" },
          {
            slug: "ecommerce",
            label: "Ecommerce",
            children: [
              { slug: "shopify_store_owners", label: "Shopify Store Owners" },
              { slug: "amazon_fba", label: "Amazon FBA" },
              { slug: "dtc_brand_builders", label: "DTC Brand Builders" },
            ],
          },
          { slug: "saas_founders", label: "SaaS Founders" },
          { slug: "agency_owners", label: "Agency Owners" },
          { slug: "content_business", label: "Content Business", aliases: ["creator_economy"] },
        ],
      },
      {
        slug: "marketing",
        label: "Marketing",
        children: [
          { slug: "social_media_marketing", label: "Social Media Marketing" },
          { slug: "seo", label: "SEO" },
          { slug: "paid_ads", label: "Paid Ads", aliases: ["meta_ads", "google_ads"] },
          { slug: "email_marketing", label: "Email Marketing" },
          { slug: "brand_strategy", label: "Brand Strategy" },
          { slug: "influencer_marketing", label: "Influencer Marketing" },
        ],
      },
      { slug: "sales", label: "Sales" },
      { slug: "leadership_management", label: "Leadership & Management" },
      {
        slug: "career_advice",
        label: "Career Advice",
        children: [
          { slug: "job_search_resume", label: "Job Search & Resume" },
          { slug: "interviewing", label: "Interviewing" },
          { slug: "negotiation", label: "Negotiation" },
          { slug: "corporate_life_humor", label: "Corporate Life Humor", aliases: ["corporate_creators"] },
        ],
      },
      {
        slug: "trades_skilled_labor",
        label: "Trades & Skilled Labor",
        children: [
          { slug: "electrician", label: "Electrician" },
          { slug: "plumber", label: "Plumber" },
          { slug: "construction", label: "Construction" },
          { slug: "trucking", label: "Trucking" },
        ],
      },
    ],
  },

  // ──────────────── Music ────────────────
  {
    slug: "music",
    label: "Music",
    icon: "🎵",
    children: [
      {
        slug: "music_production",
        label: "Music Production",
        children: [
          { slug: "beat_making", label: "Beat Making" },
          { slug: "songwriting", label: "Songwriting" },
          { slug: "mixing_mastering", label: "Mixing & Mastering" },
          { slug: "home_studio", label: "Home Studio" },
        ],
      },
      {
        slug: "instrument_lessons",
        label: "Instrument Lessons",
        children: [
          { slug: "guitar", label: "Guitar" },
          { slug: "piano", label: "Piano" },
          { slug: "drums", label: "Drums" },
          { slug: "bass", label: "Bass" },
        ],
      },
      { slug: "vocal_singing", label: "Vocal & Singing" },
      { slug: "dj", label: "DJ" },
      {
        slug: "genres",
        label: "Genres",
        children: [
          { slug: "hip_hop_creators", label: "Hip-Hop Creators" },
          { slug: "pop_creators", label: "Pop Creators" },
          { slug: "rock_metal_creators", label: "Rock & Metal Creators" },
          { slug: "electronic_edm", label: "Electronic / EDM" },
          { slug: "country_creators", label: "Country Creators" },
          { slug: "jazz_creators", label: "Jazz Creators" },
          { slug: "classical_creators", label: "Classical Creators" },
        ],
      },
      { slug: "music_reaction_analysis", label: "Music Reaction & Analysis" },
      { slug: "music_industry_business", label: "Music Industry & Business" },
    ],
  },
];

/**
 * Walk the tree and yield each node with computed `path` and `level`.
 * Path is dotted to match Postgres `ltree` (e.g. `sports.fitness.yoga`).
 */
export interface FlatNiche {
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  aliases: string[];
  parent_slug: string | null;
  parent_path: string | null;
  path: string;
  level: number;
  sort_order: number;
}

export function flattenTree(
  nodes: NicheNode[] = NICHE_TREE,
  parent: { path: string | null; slug: string | null } = { path: null, slug: null },
  level = 1,
): FlatNiche[] {
  const out: FlatNiche[] = [];
  nodes.forEach((node, i) => {
    const path = parent.path ? `${parent.path}.${node.slug}` : node.slug;
    out.push({
      slug: node.slug,
      label: node.label,
      description: node.description,
      icon: node.icon,
      aliases: node.aliases ?? [],
      parent_slug: parent.slug,
      parent_path: parent.path,
      path,
      level,
      sort_order: i,
    });
    if (node.children?.length) {
      out.push(...flattenTree(node.children, { path, slug: node.slug }, level + 1));
    }
  });
  return out;
}

/**
 * Find a node by slug anywhere in the tree.
 */
export function findNicheBySlug(slug: string, nodes: NicheNode[] = NICHE_TREE): NicheNode | null {
  for (const n of nodes) {
    if (n.slug === slug) return n;
    if (n.children?.length) {
      const hit = findNicheBySlug(slug, n.children);
      if (hit) return hit;
    }
  }
  return null;
}

/**
 * Total count of nodes in the tree (handy for tests/seeds).
 */
export function countNodes(nodes: NicheNode[] = NICHE_TREE): number {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.children ?? []), 0);
}
