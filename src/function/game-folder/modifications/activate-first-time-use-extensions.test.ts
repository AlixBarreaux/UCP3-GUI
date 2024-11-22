import { describe, expect, test } from 'vitest';
import {
  deserializeSimplifiedSerializedExtensionsStateFromExtensions,
  SimplifiedSerializedExtension,
} from '../../../testing/dump-extensions-state';
import { activateFirstTimeUseExtensions } from './activate-first-time-use-extensions';
import { createExtensionID } from '../../global/constants/extension-id';

const extensionsJSON = `
[
  {
    "name": "aicloader",
    "version": "1.1.0",
    "type": "module",
    "definition": {
      "name": "aicloader",
      "display-name": "AIC Loader",
      "version": "1.1.0",
      "author": "gynt, TheRedDaemon",
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "dependencies": {}
    },
    "configEntries": {}
  },
  {
    "name": "aiSwapper",
    "version": "1.1.0",
    "type": "module",
    "definition": {
      "name": "aiSwapper",
      "display-name": "AI Swapper",
      "version": "1.1.0",
      "author": "TheRedDaemon, gynt",
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "dependencies": {
        "gmResourceModifier": ">= 0.1.0",
        "textResourceModifier": ">= 0.1.0",
        "aicloader": ">= 0.1.0",
        "aivloader": ">= 0.0.1",
        "files": ">= 0.1.0"
      }
    },
    "configEntries": {}
  },
  {
    "name": "aivloader",
    "version": "1.0.0",
    "type": "module",
    "definition": {
      "name": "aivloader",
      "display-name": "AIV Loader",
      "version": "1.0.0",
      "author": "gynt, TheRedDaemon",
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "dependencies": {
        "files": ">= 0.0.1"
      }
    },
    "configEntries": {}
  },
  {
    "name": "files",
    "version": "1.1.0",
    "type": "module",
    "definition": {
      "name": "files",
      "version": "1.1.0",
      "author": [
        "gynt",
        "TheRedDaemon"
      ],
      "meta": {
        "version": "1.0.0"
      },
      "dependencies": {},
      "type": "module",
      "display-name": "files"
    },
    "configEntries": {}
  },
  {
    "name": "gmResourceModifier",
    "version": "0.2.0",
    "type": "module",
    "definition": {
      "name": "gmResourceModifier",
      "display-name": "Gm Resource Modifier",
      "version": "0.2.0",
      "author": "TheRedDaemon",
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "dependencies": {}
    },
    "configEntries": {}
  },
  {
    "name": "graphicsApiReplacer",
    "version": "1.2.0",
    "type": "module",
    "definition": {
      "name": "graphicsApiReplacer",
      "display-name": "Graphics API Replacer",
      "version": "1.2.0",
      "author": "TheRedDaemon",
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "dependencies": {
        "winProcHandler": ">= 0.1.0"
      }
    },
    "configEntries": {}
  },
  {
    "name": "maploader",
    "version": "1.0.0",
    "type": "module",
    "definition": {
      "name": "maploader",
      "version": "1.0.0",
      "author": "gynt",
      "game": [
        "SHC==1.41"
      ],
      "dependencies": {
        "files": ">= 0.2.0"
      },
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "display-name": "maploader"
    },
    "configEntries": {}
  },
  {
    "name": "startResources",
    "version": "1.0.0",
    "type": "module",
    "definition": {
      "name": "startResources",
      "display-name": "Start Resources & Troops",
      "author": "gynt",
      "version": "1.0.0",
      "dependencies": {},
      "type": "module"
    },
    "configEntries": {}
  },
  {
    "name": "textResourceModifier",
    "version": "0.3.0",
    "type": "module",
    "definition": {
      "name": "textResourceModifier",
      "display-name": "Text Resource Modifier",
      "version": "0.3.0",
      "author": "TheRedDaemon",
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "dependencies": {}
    },
    "configEntries": {}
  },
  {
    "name": "ucp2-legacy",
    "version": "2.15.1",
    "type": "module",
    "definition": {
      "name": "ucp2-legacy",
      "display-name": "UCP2-Legacy",
      "version": "2.15.1",
      "default": true,
      "game": [
        "SHC==1.41",
        "SHCE==1.41"
      ],
      "meta": {
        "version": "1.0.0"
      },
      "dependencies": {},
      "type": "module"
    },
    "configEntries": {}
  },
  {
    "name": "winProcHandler",
    "version": "0.2.0",
    "type": "module",
    "definition": {
      "name": "winProcHandler",
      "display-name": "WinProc Handler",
      "version": "0.2.0",
      "author": "TheRedDaemon",
      "meta": {
        "version": "1.0.0"
      },
      "type": "module",
      "dependencies": {}
    },
    "configEntries": {}
  },
  {
    "name": "Aggressive-AI-Behaviour",
    "version": "1.4.0",
    "type": "plugin",
    "definition": {
      "name": "Aggressive-AI-Behaviour",
      "display-name": "Aggressive AI Behaviour",
      "author": "Krarilotus",
      "version": "1.4.0",
      "dependencies": {
        "aiSwapper": "^1.0.1",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {}
  },
  {
    "name": "Aggressive-AI-Behaviour-Applied",
    "version": "1.4.0",
    "type": "plugin",
    "definition": {
      "name": "Aggressive-AI-Behaviour-Applied",
      "display-name": "Aggressive AI Behaviour Applied",
      "author": "Krarilotus",
      "version": "1.4.0",
      "dependencies": {
        "Aggressive-AI-Behaviour": "^1.4.0",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {
      "aiSwapper.menu": {
        "contents": {
          "suggested-value": {
            "rat": [
              {
                "name": "Aggressive Rat",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Rat/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "snake": [
              {
                "name": "Aggressive Snake",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Snake/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "pig": [
              {
                "name": "Aggressive Pig",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Pig/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "wolf": [
              {
                "name": "Aggressive Wolf",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wolf/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "saladin": [
              {
                "name": "Aggressive Saladin",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Saladin/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "caliph": [
              {
                "name": "Aggressive Caliph",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Caliph/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "sultan": [
              {
                "name": "Aggressive Sultan",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sultan/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "richard": [
              {
                "name": "Aggressive Richard",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Richard/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "frederick": [
              {
                "name": "Aggressive Frederick",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Frederick/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "phillip": [
              {
                "name": "Aggressive Phillip",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Phillip/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "wazir": [
              {
                "name": "Aggressive Wazir",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "emir": [
              {
                "name": "Aggressive Wazir",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "nizar": [
              {
                "name": "Aggressive Nizar",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Nizar/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "sheriff": [
              {
                "name": "Aggressive Sheriff",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sheriff/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "marshal": [
              {
                "name": "Aggressive Marshal",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Marshal/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "abbot": [
              {
                "name": "Aggressive-Abbot",
                "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Abbot/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ]
          }
        }
      },
      "aiSwapper.defaultLanguage": {
        "contents": {
          "suggested-value": null
        }
      },
      "aiSwapper.ai.rat.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Rat",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Rat/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.rat.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Rat",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Rat/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.rat.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Rat",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Rat/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Snake",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Snake/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Snake",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Snake/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Snake",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Snake/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Pig",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Pig/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Pig",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Pig/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Pig",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Pig/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wolf",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wolf/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wolf",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wolf/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wolf",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wolf/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Saladin",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Saladin/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Saladin",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Saladin/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Saladin",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Saladin/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Caliph",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Caliph/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Caliph",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Caliph/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Caliph",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Caliph/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Sultan",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sultan/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Sultan",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sultan/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Sultan",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sultan/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Richard",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Richard/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Richard",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Richard/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Richard",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Richard/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Frederick",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Frederick/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Frederick",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Frederick/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Frederick",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Frederick/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Phillip",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Phillip/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Phillip",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Phillip/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Phillip",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Phillip/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wazir",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wazir",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wazir",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wazir",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wazir",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Wazir",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Wazir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Nizar",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Nizar/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Nizar",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Nizar/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Nizar",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Nizar/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Sheriff",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sheriff/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Sheriff",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sheriff/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Sheriff",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Sheriff/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Marshal",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Marshal/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Marshal",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Marshal/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive Marshal",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Marshal/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.aic": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive-Abbot",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Abbot/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.lord": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive-Abbot",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Abbot/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "Aggressive-Abbot",
            "root": "ucp/plugins/Aggressive-AI-Behaviour/resources/ai/Abbot/",
            "active": true
          }
        }
      }
    }
  },
  {
    "name": "ucp2-ai-files",
    "version": "2.15.1",
    "type": "plugin",
    "definition": {
      "name": "ucp2-ai-files",
      "display-name": "UCP2-Legacy: Revised AI Files",
      "author": "UCP-Team",
      "version": "2.15.1",
      "dependencies": {
        "aiSwapper": "^1.0.1",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "meta": {
        "version": "1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {}
  },
  {
    "name": "ucp2-aic-patch",
    "version": "2.15.1",
    "type": "plugin",
    "definition": {
      "name": "ucp2-aic-patch",
      "display-name": "UCP2-Legacy: Patched AI Behaviour",
      "author": "UCP-Team",
      "version": "2.15.1",
      "dependencies": {
        "ucp2-ai-files": "^2.15.1",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {
      "aiSwapper.menu": {
        "contents": {
          "suggested-value": {
            "rat": [
              {
                "name": "UCP-AIC-Rat",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/rat_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "snake": [
              {
                "name": "UCP-AIC-Snake",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/snake_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "pig": [
              {
                "name": "UCP-AIC-Pig",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/pig_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "wolf": [
              {
                "name": "UCP-AIC-Wolf",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/wolf_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "saladin": [
              {
                "name": "UCP-AIC-Saladin",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/saladin_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "caliph": [
              {
                "name": "UCP-AIC-Caliph",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/caliph_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "sultan": [
              {
                "name": "UCP-AIC-Sultan",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/sultan_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "richard": [
              {
                "name": "UCP-AIC-Richard",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/richard_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "frederick": [
              {
                "name": "UCP-AIC-Frederick",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/frederick_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "phillip": [
              {
                "name": "UCP-AIC-Phillip",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/phillip_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "wazir": [
              {
                "name": "UCP-AIC-Wazir",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/wazir_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "emir": [
              {
                "name": "UCP-AIC-Emir",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/emir_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "nizar": [
              {
                "name": "UCP-AIC-Nizar",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/nizar_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "sheriff": [
              {
                "name": "UCP-AIC-Sheriff",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/sheriff_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "marshal": [
              {
                "name": "UCP-AIC-Marshal",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/marshal_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ],
            "abbot": [
              {
                "name": "UCP-AIC-Abbot",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/abbot_UCP_AIC/",
                "control": {
                  "aic": true,
                  "lord": true,
                  "startTroops": true
                }
              }
            ]
          }
        }
      },
      "aiSwapper.defaultLanguage": {
        "contents": {
          "suggested-value": null
        }
      },
      "aiSwapper.ai.rat.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Rat",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/rat_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.rat.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Rat",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/rat_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.rat.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Rat",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/rat_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Snake",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/snake_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Snake",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/snake_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Snake",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/snake_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Pig",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/pig_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Pig",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/pig_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Pig",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/pig_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Wolf",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wolf_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Wolf",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wolf_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Wolf",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wolf_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Saladin",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/saladin_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Saladin",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/saladin_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Saladin",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/saladin_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Caliph",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/caliph_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Caliph",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/caliph_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Caliph",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/caliph_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Sultan",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sultan_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Sultan",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sultan_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Sultan",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sultan_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Richard",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/richard_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Richard",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/richard_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Richard",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/richard_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Frederick",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/frederick_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Frederick",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/frederick_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Frederick",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/frederick_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Phillip",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/phillip_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Phillip",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/phillip_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Phillip",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/phillip_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Wazir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wazir_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Wazir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wazir_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Wazir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wazir_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Emir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/emir_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Emir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/emir_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Emir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/emir_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Nizar",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/nizar_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Nizar",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/nizar_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Nizar",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/nizar_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Sheriff",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sheriff_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Sheriff",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sheriff_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Sheriff",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sheriff_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Marshal",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/marshal_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Marshal",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/marshal_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Marshal",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/marshal_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.aic": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Abbot",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/abbot_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.lord": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Abbot",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/abbot_UCP_AIC/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.startTroops": {
        "contents": {
          "suggested-value": {
            "name": "UCP-AIC-Abbot",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/abbot_UCP_AIC/",
            "active": true
          }
        }
      }
    }
  },
  {
    "name": "ucp2-legacy-defaults",
    "version": "2.15.1",
    "type": "plugin",
    "definition": {
      "name": "ucp2-legacy-defaults",
      "display-name": "UCP2-Legacy: Default Settings",
      "author": "gynt",
      "version": "2.15.1",
      "dependencies": {
        "ucp2-legacy": "^2.15.1",
        "ucp2-ai-files": "^2.15.1",
        "ucp2-aic-patch": "^2.15.1",
        "ucp2-vanilla-fixed-aiv": "^2.15.1"
      },
      "meta": {
        "version": "1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {
      "ucp2-legacy.ai_attacklimit": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 500
          }
        }
      },
      "ucp2-legacy.ai_assaultswitch.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_attackwave": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 7
          }
        }
      },
      "ucp2-legacy.ai_access.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_rebuild.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_tethers.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_buywood.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_defense.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_fix_crusader_archers_pitch.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_fix_laddermen_with_enclosed_keep.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_towerengines.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_freetrader.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_responsivegates.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_gamespeed.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_healer.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_moatvisibility.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_arabwall.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_arabxbow.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_fireballistafix.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_laddermen.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_spearmen.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_tanner_fix.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.fix_apple_orchard_build_size.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_baker_disappear.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_fletcher_bug.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_ladderclimb.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_moat_digging_unit_disappearing.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_fix_applefarm_blocking.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_fix_lord_animation_stuck_movement.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_default_multiplayer_speed": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 50
          }
        }
      },
      "ucp2-legacy.o_increase_path_update_tick_rate.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_engineertent.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_nosleep.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_housing.build_housing": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 5
          }
        }
      },
      "ucp2-legacy.ai_housing.campfire_housing": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 8
          }
        }
      },
      "ucp2-legacy.ai_housing.delete_housing.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_resources_rebuy.flour": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 2
          }
        }
      },
      "ucp2-legacy.ai_resources_rebuy.iron": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 36
          }
        }
      },
      "ucp2-legacy.ai_resources_rebuy.wood": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 36
          }
        }
      },
      "ucp2-legacy.ai_demolish.ai_demolish_walls.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_demolish.ai_demolish_trapped.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_map_sending.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_rapid_deletion_bug.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_restore_arabian_engineer_speech.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fast_placing.enabled": {
        "contents": {
          "suggested-value": true
        }
      }
    }
  },
  {
    "name": "ucp2-vanilla-fixed-aiv",
    "version": "2.15.1",
    "type": "plugin",
    "definition": {
      "name": "ucp2-vanilla-fixed-aiv",
      "display-name": "Vanilla Fixed Castles",
      "author": "UCP-Team",
      "version": "2.15.1",
      "dependencies": {
        "ucp2-ai-files": "^2.15.1",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {
      "aiSwapper.menu": {
        "contents": {
          "suggested-value": {
            "rat": [
              {
                "name": "Fixed-Rat",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/rat_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "snake": [
              {
                "name": "Fixed-Snake",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/snake_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "pig": [
              {
                "name": "Fixed-Pig",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/pig_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "wolf": [
              {
                "name": "Fixed-Wolf",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/wolf_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "saladin": [
              {
                "name": "Fixed-Saladin",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/saladin_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "caliph": [
              {
                "name": "Fixed-Caliph",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/caliph_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "sultan": [
              {
                "name": "Fixed-Sultan",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/sultan_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "richard": [
              {
                "name": "Fixed-Richard",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/richard_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "frederick": [
              {
                "name": "Fixed-Frederick",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/frederick_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "phillip": [
              {
                "name": "Fixed-Phillip",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/phillip_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "wazir": [
              {
                "name": "Fixed-Wazir",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/wazir_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "emir": [
              {
                "name": "Fixed-Emir",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/emir_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "nizar": [
              {
                "name": "Fixed-Nizar",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/nizar_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "sheriff": [
              {
                "name": "Fixed-Sheriff",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/sheriff_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "marshal": [
              {
                "name": "Fixed-Marshal",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/marshal_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "abbot": [
              {
                "name": "Fixed-Abbot",
                "root": "ucp/plugins/ucp2-ai-files/resources/ai/abbot_VanillaFixed/",
                "control": {
                  "aiv": true
                }
              }
            ]
          }
        }
      },
      "aiSwapper.defaultLanguage": {
        "contents": {
          "suggested-value": null
        }
      },
      "aiSwapper.ai.rat.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Rat",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/rat_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Snake",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/snake_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Pig",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/pig_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Wolf",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wolf_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Saladin",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/saladin_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Caliph",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/caliph_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Sultan",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sultan_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Richard",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/richard_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Frederick",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/frederick_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Phillip",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/phillip_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Wazir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/wazir_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Emir",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/emir_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Nizar",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/nizar_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Sheriff",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/sheriff_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Marshal",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/marshal_VanillaFixed/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Fixed-Abbot",
            "root": "ucp/plugins/ucp2-ai-files/resources/ai/abbot_VanillaFixed/",
            "active": true
          }
        }
      }
    }
  },
  {
    "name": "Vanilla-Interpretation-Castles",
    "version": "1.0.2",
    "type": "plugin",
    "definition": {
      "name": "Vanilla-Interpretation-Castles",
      "display-name": "Vanilla Interpretation Castles",
      "author": "Krarilotus",
      "version": "1.0.2",
      "dependencies": {
        "aiSwapper": "^1.0.1",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {}
  },
  {
    "name": "Vanilla-Interpretation-Castles-Applied",
    "version": "1.0.2",
    "type": "plugin",
    "definition": {
      "name": "Vanilla-Interpretation-Castles-Applied",
      "display-name": "Vanilla Interpretation Castles Applied",
      "author": "Krarilotus",
      "version": "1.0.2",
      "dependencies": {
        "Vanilla-Interpretation-Castles": "^1.0.2",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {
      "aiSwapper.menu": {
        "contents": {
          "suggested-value": {
            "rat": [
              {
                "name": "Vanilla-Interpretation Rat",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Rat/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "snake": [
              {
                "name": "Vanilla-Interpretation Snake",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Snake/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "pig": [
              {
                "name": "Vanilla-Interpretation Pig",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Pig/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "wolf": [
              {
                "name": "Vanilla-Interpretation Wolf",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Wolf/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "saladin": [
              {
                "name": "Vanilla-Interpretation Saladin",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Saladin/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "caliph": [
              {
                "name": "Vanilla-Interpretation Caliph",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Caliph/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "sultan": [
              {
                "name": "Vanilla-Interpretation Sultan",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Sultan/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "richard": [
              {
                "name": "Vanilla-Interpretation Richard",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Richard/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "frederick": [
              {
                "name": "Vanilla-Interpretation Frederick",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Frederick/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "phillip": [
              {
                "name": "Vanilla-Interpretation Phillip",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Phillip/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "wazir": [
              {
                "name": "Vanilla-Interpretation Wazir",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Wazir/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "emir": [
              {
                "name": "Vanilla-Interpretation Emir",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Emir/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "nizar": [
              {
                "name": "Vanilla-Interpretation Nizar",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Nizar/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "sheriff": [
              {
                "name": "Vanilla-Interpretation Sheriff",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Sheriff/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "marshal": [
              {
                "name": "Vanilla-Interpretation Marshal",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Marshall/",
                "control": {
                  "aiv": true
                }
              }
            ],
            "abbot": [
              {
                "name": "Vanilla-Interpretation Abbot",
                "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Abbot/",
                "control": {
                  "aiv": true
                }
              }
            ]
          }
        }
      },
      "aiSwapper.defaultLanguage": {
        "contents": {
          "suggested-value": null
        }
      },
      "aiSwapper.ai.rat.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Rat",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Rat/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.snake.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Snake",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Snake/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.pig.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Pig",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Pig/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wolf.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Wolf",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Wolf/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.saladin.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Saladin",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Saladin/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.caliph.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Caliph",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Caliph/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sultan.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Sultan",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Sultan/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.richard.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Richard",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Richard/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.frederick.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Frederick",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Frederick/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.phillip.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Phillip",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Phillip/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.wazir.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Wazir",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Wazir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.emir.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Emir",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Emir/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.nizar.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Nizar",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Nizar/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.sheriff.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Sheriff",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Sheriff/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.marshal.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Marshal",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Marshall/",
            "active": true
          }
        }
      },
      "aiSwapper.ai.abbot.aiv": {
        "contents": {
          "suggested-value": {
            "name": "Vanilla-Interpretation Abbot",
            "root": "ucp/plugins/Vanilla-Interpretation-Castles/resources/ai/Abbot/",
            "active": true
          }
        }
      }
    }
  },
  {
    "name": "Vanilla-Retraced-Unlocked",
    "version": "1.0.1",
    "type": "plugin",
    "definition": {
      "name": "Vanilla-Retraced-Unlocked",
      "display-name": "Vanilla Retraced Unlocked",
      "author": "Krarilotus & Crusader Pilaw",
      "version": "1.0.1",
      "dependencies": {
        "startResources": "^1.0.0",
        "ucp2-legacy": "^2.15.1",
        "maploader": "^1.0.0",
        "graphicsApiReplacer": "^1.2.0",
        "Aggressive-AI-Behaviour-Applied": "^1.4.0",
        "Vanilla-Interpretation-Castles-Applied": "^1.0.2",
        "framework": "^3.0.0",
        "frontend": "^1.0.0"
      },
      "type": "plugin"
    },
    "configEntries": {
      "ucp2-legacy.ai_resources_rebuy.flour": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 2
          }
        }
      },
      "ucp2-legacy.ai_resources_rebuy.iron": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 3
          }
        }
      },
      "ucp2-legacy.ai_resources_rebuy.wood": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 1
          }
        }
      },
      "ucp2-legacy.o_fast_placing.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_change_siege_engine_spawn_position_catapult.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_fix_rapid_deletion_bug.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_map_sending.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_access.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_assaultswitch.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_buywood.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_defense.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_addattack": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "choice": "relative",
            "choices": {
              "absolute": {
                "slider": 5
              },
              "relative": {
                "slider": 0.3
              }
            }
          }
        }
      },
      "ucp2-legacy.ai_attacklimit": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 1000
          }
        }
      },
      "ucp2-legacy.ai_fix_crusader_archers_pitch.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_fix_laddermen_with_enclosed_keep.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_nosleep.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_rebuild.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_tethers.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_towerengines.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_attackwave": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 10
          }
        }
      },
      "ucp2-legacy.ai_recruitstate_initialtimer": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 0
          }
        }
      },
      "ucp2-legacy.ai_demolish.ai_demolish_walls.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_demolish.ai_demolish_trapped.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_demolish.ai_demolish_eco.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_housing.build_housing": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 8
          }
        }
      },
      "ucp2-legacy.ai_housing.campfire_housing": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 10
          }
        }
      },
      "ucp2-legacy.ai_housing.delete_housing.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.fix_apple_orchard_build_size.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_freetrader.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_healer.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_responsivegates.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_arabwall.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_arabxbow.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_laddermen.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_spearmen.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_spearmen_run.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_baker_disappear.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_fletcher_bug.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_ladderclimb.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_fix_moat_digging_unit_disappearing.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_restore_arabian_engineer_speech.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_fireballistafix.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_fix_applefarm_blocking.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_fix_lord_animation_stuck_movement.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.u_tanner_fix.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_increase_path_update_tick_rate.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.ai_attacktarget": {
        "contents": {
          "suggested-value": {
            "enabled": false,
            "choice": ""
          }
        }
      },
      "ucp2-legacy.ai_recruitinterval.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_firecooldown": {
        "contents": {
          "suggested-value": {
            "enabled": false,
            "sliderValue": 2000
          }
        }
      },
      "ucp2-legacy.o_shfy.o_shfy_beer.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_shfy.o_shfy_religion.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_shfy.o_shfy_peasantspawnrate.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_shfy.o_shfy_resourcequantity.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_xtreme.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_onlyai.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_override_identity_menu.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_default_multiplayer_speed": {
        "contents": {
          "suggested-value": {
            "enabled": true,
            "sliderValue": 50
          }
        }
      },
      "ucp2-legacy.o_engineertent.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_gamespeed.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "ucp2-legacy.o_keys.enabled": {
        "contents": {
          "suggested-value": false
        }
      },
      "ucp2-legacy.o_moatvisibility.enabled": {
        "contents": {
          "suggested-value": true
        }
      },
      "startResources.startGold.normal.majorHumanAdvantage.computer": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.normal.majorHumanAdvantage.human": {
        "contents": {
          "suggested-value": 8000
        }
      },
      "startResources.startGold.normal.minorHumanAdvantage.computer": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.normal.minorHumanAdvantage.human": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.normal.noAdvantage.computer": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.normal.noAdvantage.human": {
        "contents": {
          "suggested-value": 2000
        }
      },
      "startResources.startGold.normal.minorComputerAdvantage.computer": {
        "contents": {
          "suggested-value": 6000
        }
      },
      "startResources.startGold.normal.minorComputerAdvantage.human": {
        "contents": {
          "suggested-value": 2000
        }
      },
      "startResources.startGold.normal.majorComputerAdvantage.computer": {
        "contents": {
          "suggested-value": 10000
        }
      },
      "startResources.startGold.normal.majorComputerAdvantage.human": {
        "contents": {
          "suggested-value": 2000
        }
      },
      "startResources.startGold.crusader.majorHumanAdvantage.computer": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.crusader.majorHumanAdvantage.human": {
        "contents": {
          "suggested-value": 8000
        }
      },
      "startResources.startGold.crusader.minorHumanAdvantage.computer": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.crusader.minorHumanAdvantage.human": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.crusader.noAdvantage.computer": {
        "contents": {
          "suggested-value": 4000
        }
      },
      "startResources.startGold.crusader.noAdvantage.human": {
        "contents": {
          "suggested-value": 2000
        }
      },
      "startResources.startGold.crusader.minorComputerAdvantage.computer": {
        "contents": {
          "suggested-value": 6000
        }
      },
      "startResources.startGold.crusader.minorComputerAdvantage.human": {
        "contents": {
          "suggested-value": 2000
        }
      },
      "startResources.startGold.crusader.majorComputerAdvantage.computer": {
        "contents": {
          "suggested-value": 10000
        }
      },
      "startResources.startGold.crusader.majorComputerAdvantage.human": {
        "contents": {
          "suggested-value": 2000
        }
      },
      "startResources.startGold.deathmatch.majorHumanAdvantage.computer": {
        "contents": {
          "suggested-value": 10000
        }
      },
      "startResources.startGold.deathmatch.majorHumanAdvantage.human": {
        "contents": {
          "suggested-value": 40000
        }
      },
      "startResources.startGold.deathmatch.minorHumanAdvantage.computer": {
        "contents": {
          "suggested-value": 10000
        }
      },
      "startResources.startGold.deathmatch.minorHumanAdvantage.human": {
        "contents": {
          "suggested-value": 20000
        }
      },
      "startResources.startGold.deathmatch.noAdvantage.human": {
        "contents": {
          "suggested-value": 10000
        }
      },
      "startResources.startGold.deathmatch.noAdvantage.computer": {
        "contents": {
          "suggested-value": 10000
        }
      },
      "startResources.startGold.deathmatch.minorComputerAdvantage.human": {
        "contents": {
          "suggested-value": 7000
        }
      },
      "startResources.startGold.deathmatch.minorComputerAdvantage.computer": {
        "contents": {
          "suggested-value": 20000
        }
      },
      "startResources.startGold.deathmatch.majorComputerAdvantage.human": {
        "contents": {
          "suggested-value": 3000
        }
      },
      "startResources.startGold.deathmatch.majorComputerAdvantage.computer": {
        "contents": {
          "suggested-value": 40000
        }
      },
      "startResources.startTroops.crusader.normal.EuropArcher": {
        "contents": {
          "suggested-value": 5
        }
      },
      "startResources.startTroops.crusader.normal.Spearman": {
        "contents": {
          "suggested-value": 7
        }
      },
      "startResources.startTroops.crusader.normal.Crossbowman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Pikeman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Maceman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Swordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Knight": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Engineer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Monk": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.ArabArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Slave": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Slinger": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.Assassin": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.HorseArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.ArabSwordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.FireThrower": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.normal.FireBallista": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.EuropArcher": {
        "contents": {
          "suggested-value": 40
        }
      },
      "startResources.startTroops.crusader.crusader.Spearman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Crossbowman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Pikeman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Maceman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Swordsman": {
        "contents": {
          "suggested-value": 10
        }
      },
      "startResources.startTroops.crusader.crusader.Knight": {
        "contents": {
          "suggested-value": 4
        }
      },
      "startResources.startTroops.crusader.crusader.Engineer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Monk": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.ArabArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Slave": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Slinger": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.Assassin": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.HorseArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.ArabSwordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.FireThrower": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.crusader.FireBallista": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.EuropArcher": {
        "contents": {
          "suggested-value": 5
        }
      },
      "startResources.startTroops.crusader.deathmatch.Crossbowman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Spearman": {
        "contents": {
          "suggested-value": 7
        }
      },
      "startResources.startTroops.crusader.deathmatch.Pikeman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Maceman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Swordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Knight": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Engineer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Monk": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.ArabArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Slave": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Slinger": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.Assassin": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.HorseArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.ArabSwordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.FireThrower": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.crusader.deathmatch.FireBallista": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.EuropArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Crossbowman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Spearman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Pikeman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Maceman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Swordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Knight": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Engineer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Monk": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.ArabArcher": {
        "contents": {
          "suggested-value": 6
        }
      },
      "startResources.startTroops.arabian.normal.Slave": {
        "contents": {
          "suggested-value": 6
        }
      },
      "startResources.startTroops.arabian.normal.Slinger": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.Assassin": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.HorseArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.ArabSwordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.FireThrower": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.normal.FireBallista": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.EuropArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Crossbowman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Spearman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Pikeman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Maceman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Swordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Knight": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Engineer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Monk": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.ArabArcher": {
        "contents": {
          "suggested-value": 50
        }
      },
      "startResources.startTroops.arabian.crusader.Slave": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Slinger": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.Assassin": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.HorseArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.ArabSwordsman": {
        "contents": {
          "suggested-value": 10
        }
      },
      "startResources.startTroops.arabian.crusader.FireThrower": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.crusader.FireBallista": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.EuropArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Crossbowman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Spearman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Pikeman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Maceman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Swordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Knight": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Engineer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Monk": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.ArabArcher": {
        "contents": {
          "suggested-value": 6
        }
      },
      "startResources.startTroops.arabian.deathmatch.Slave": {
        "contents": {
          "suggested-value": 6
        }
      },
      "startResources.startTroops.arabian.deathmatch.Slinger": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.Assassin": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.HorseArcher": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.FireBallista": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.FireThrower": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startTroops.arabian.deathmatch.ArabSwordsman": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.wood": {
        "contents": {
          "suggested-value": 100
        }
      },
      "startResources.startGoods.normal.hop": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.stone": {
        "contents": {
          "suggested-value": 50
        }
      },
      "startResources.startGoods.normal.iron": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.pitch": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.wheat": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.bread": {
        "contents": {
          "suggested-value": 60
        }
      },
      "startResources.startGoods.normal.cheese": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.meat": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.fruit": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.beer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.flour": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.bows": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.crossbows": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.spears": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.pikes": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.maces": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.swords": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.leatherarmor": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.normal.metalarmor": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.wood": {
        "contents": {
          "suggested-value": 100
        }
      },
      "startResources.startGoods.crusader.hop": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.stone": {
        "contents": {
          "suggested-value": 50
        }
      },
      "startResources.startGoods.crusader.iron": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.pitch": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.wheat": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.bread": {
        "contents": {
          "suggested-value": 60
        }
      },
      "startResources.startGoods.crusader.cheese": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.meat": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.fruit": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.beer": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.flour": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.bows": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.crossbows": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.spears": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.pikes": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.maces": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.swords": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.leatherarmor": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.crusader.metalarmor": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.wood": {
        "contents": {
          "suggested-value": 150
        }
      },
      "startResources.startGoods.deathmatch.hop": {
        "contents": {
          "suggested-value": 20
        }
      },
      "startResources.startGoods.deathmatch.stone": {
        "contents": {
          "suggested-value": 150
        }
      },
      "startResources.startGoods.deathmatch.iron": {
        "contents": {
          "suggested-value": 25
        }
      },
      "startResources.startGoods.deathmatch.pitch": {
        "contents": {
          "suggested-value": 48
        }
      },
      "startResources.startGoods.deathmatch.wheat": {
        "contents": {
          "suggested-value": 25
        }
      },
      "startResources.startGoods.deathmatch.bread": {
        "contents": {
          "suggested-value": 200
        }
      },
      "startResources.startGoods.deathmatch.cheese": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.meat": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.fruit": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.beer": {
        "contents": {
          "suggested-value": 10
        }
      },
      "startResources.startGoods.deathmatch.flour": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.bows": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.crossbows": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.spears": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.pikes": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.maces": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.swords": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.leatherarmor": {
        "contents": {
          "suggested-value": 0
        }
      },
      "startResources.startGoods.deathmatch.metalarmor": {
        "contents": {
          "suggested-value": 0
        }
      },
      "maploader.extra-map-directory": {
        "contents": {
          "suggested-value": "ucp/plugins/Vanilla-Retraced-Unlocked-*/resources/maps"
        }
      },
      "maploader.extra-map-extreme-directory": {
        "contents": {
          "suggested-value": "ucp/plugins/Vanilla-Retraced-Unlocked-*/resources/maps"
        }
      },
      "graphicsApiReplacer.window.type": {
        "contents": {
          "suggested-value": "borderlessFullscreen"
        }
      },
      "graphicsApiReplacer.window.continueOutOfFocus": {
        "contents": {
          "suggested-value": "pause"
        }
      },
      "graphicsApiReplacer.window.width": {
        "contents": {
          "suggested-value": 1920
        }
      },
      "graphicsApiReplacer.window.height": {
        "contents": {
          "suggested-value": 1080
        }
      },
      "graphicsApiReplacer.graphic.vsync": {
        "contents": {
          "suggested-value": true
        }
      }
    }
  }
]

`;

describe('activateFirstTimeUseExtensions', () => {
  test('expect valid state to work', () => {
    const extensionsState =
      deserializeSimplifiedSerializedExtensionsStateFromExtensions(
        JSON.parse(extensionsJSON),
      );

    const result = activateFirstTimeUseExtensions(extensionsState);

    expect(result.isOk()).toBe(true);

    const state = result.getOrThrow();

    expect(
      state.activeExtensions.map((ext) => createExtensionID(ext)),
    ).toStrictEqual([
      'graphicsApiReplacer@1.2.0',
      'winProcHandler@0.2.0',
      'ucp2-legacy-defaults@2.15.1',
      'ucp2-vanilla-fixed-aiv@2.15.1',
      'ucp2-aic-patch@2.15.1',
      'ucp2-ai-files@2.15.1',
      'aiSwapper@1.1.0',
      'aivloader@1.0.0',
      'files@1.1.0',
      'aicloader@1.1.0',
      'textResourceModifier@0.3.0',
      'gmResourceModifier@0.2.0',
      'ucp2-legacy@2.15.1',
    ]);
  });

  test('expect invalid state to fail', () => {
    const filteredExtensions = JSON.parse(extensionsJSON).filter(
      (e: SimplifiedSerializedExtension) => e.name !== 'aiSwapper',
    );
    const extensionsState =
      deserializeSimplifiedSerializedExtensionsStateFromExtensions(
        filteredExtensions,
      );

    expect(() => activateFirstTimeUseExtensions(extensionsState)).toThrowError(
      'Error: Could not fix dependency issues: ucp2-legacy-defaults: 2.15.1 ()',
    );
  });
});