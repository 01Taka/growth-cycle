import json
import os
from typing import Dict, Any, List, Union

# --- グローバル定数 (ユーザー指定のパス) ---
MODULES_CONFIG_JSON_PATH = 'src/json/plantsConfig/modules_config.json'
PLANTS_CONFIG_JSON_PATH = 'src/json/plantsConfig/plants_config.json'
SEEDS_CONFIG_JSON_PATH = 'src/json/plantsConfig/seeds_config.json'

# --- ヘルパー関数 (既存の構造から再定義) ---

def get_plant_key(seed_type: str, plant_type: str) -> str:
    """PlantSettingを参照するためのキーを生成する (例: ART_SAKURAA)"""
    keys = [seed_type, plant_type]
    return '_'.join(key.upper() for key in keys)

def get_module_key(
    seed_type: str,
    plant_type: str,
    part_type: str,
    module_type: str
) -> str:
    """モジュールを一意に識別するためのグローバルキーを生成する (例: ART_SAKURAA_STEM_THIN_V3)"""
    keys = [seed_type, plant_type, part_type, module_type]
    return '_'.join(key.upper() for key in keys)

def load_config(path: str) -> Dict[str, Any]:
    """JSON設定ファイルを読み込むヘルパー関数"""
    print(f"[INFO] Loading: {path}")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"[ERROR] Config file not found at: {path}")
        return {}
    except json.JSONDecodeError:
        print(f"[ERROR] Invalid JSON format in: {path}")
        return {}

# --- メインロジック関数 ---

def reverse_engineer_new_plants_json(
    seed_type: str, 
    plant_type: str
) -> Union[Dict[str, Any], None]:
    """
    seeds, plants, modulesの各設定ファイルから、
    new_plants.jsonの構造を逆生成します。
    """
    print(f"--- [START] Reverse Engineering for {seed_type.upper()}/{plant_type.upper()} ---")

    # 1. すべての設定ファイルを読み込み
    seeds_config = load_config(SEEDS_CONFIG_JSON_PATH)
    plants_config = load_config(PLANTS_CONFIG_JSON_PATH)
    modules_config = load_config(MODULES_CONFIG_JSON_PATH)
    
    if not (seeds_config and plants_config and modules_config):
        print("[FATAL] Required configuration files could not be loaded. Aborting.")
        return None

    # 2. Plant全体の基本情報を Seeds Config から取得
    seed_type_lower = seed_type.lower()
    plant_option_data = seeds_config.get(seed_type_lower, {}).get('plants', {}).get(plant_type)
    
    if not plant_option_data:
        print(f"[ERROR] Plant Option data not found in Seeds Config for: {seed_type}/{plant_type}")
        return None

    # 3. PlantTypeごとのモジュール抽選情報を Plants Config から取得
    plant_key = get_plant_key(seed_type, plant_type)
    plant_setting = plants_config.get(plant_key)
    
    if not plant_setting or 'modules' not in plant_setting:
        print(f"[ERROR] Plant Setting or Modules data not found in Plants Config for: {plant_key}")
        return None
        
    plant_modules_structure = plant_setting['modules']
    plant_rarity_from_plants = plant_setting.get('rarity', plant_option_data.get('rarity', ''))

    # 4. モジュール情報を集約し、zIndexとimage_filenameを結合
    final_modules_map: Dict[str, List[Dict[str, Any]]] = {}
    
    # modules: Record<partType, Record<moduleType, ModuleOption>> を反復処理
    for part_type, module_type_options in plant_modules_structure.items():
        final_modules_map[part_type] = []
        
        # moduleTypeごとの抽選情報を反復処理
        for module_type, module_option in module_type_options.items():
            # 5. グローバルキーを生成し、Modules Configから静的情報を取得
            module_key = get_module_key(seed_type, plant_type, part_type, module_type)
            module_setting = modules_config.get(module_key, {})
            
            if not module_setting:
                print(f"[WARNING] Module Setting not found for key: {module_key}. Skipping.")
                continue

            # 6. new_plants.json 構造のモジュールアイテムを構築
            module_item: Dict[str, Any] = {
                "moduleType": module_type,
                "moduleRarity": module_option.get('moduleRarity', ''),
                "weight": module_option.get('weight', 0),
                "zIndex": module_setting.get('zIndex', 0),
                # imgPathをimage_filenameとして抽出
                "image_filename": os.path.basename(module_setting.get('imgPath', ''))
            }
            
            final_modules_map[part_type].append(module_item)
            
    if not any(final_modules_map.values()):
        print("[WARNING] No valid modules were found for this plant.")

    # 7. 最終的な new_plants.json 構造の構築
    result_data = {
        "seed_type": seed_type,
        "plant_type": plant_type,
        # PlantOptionから取得した情報
        "min_size": plant_option_data.get('minSize', 0),
        "max_size": plant_option_data.get('maxSize', 0),
        "rarity": plant_option_data.get('rarity', plant_rarity_from_plants), # Optionのrarityを優先
        "weight": plant_option_data.get('weight', 0),
        # 結合されたモジュール情報
        "modules": final_modules_map
    }
    
    print("--- [SUCCESS] Reverse Engineering complete. ---")
    return result_data

if __name__ == '__main__':
    # ユーザーに入力を求める
    print("\n-----------------------------------------------------")
    print("設定ファイルの逆生成を実行します。")
    print("例: Seed Type -> Art, Plant Type -> SakuraA または RoseB")
    print("-----------------------------------------------------")
    
    # input関数でseed_typeとplant_typeを取得
    seed_type_input = input("Seed Type (例: Art): ")
    plant_type_input = input("Plant Type (例: SakuraA): ")

    # 逆生成を実行
    result = reverse_engineer_new_plants_json(
        seed_type=seed_type_input, 
        plant_type=plant_type_input
    )
    
    if result:
        print("\n--- [RESULT] Generated new_plants.json structure ---")
        print(json.dumps(result, indent=4, ensure_ascii=False))
    else:
        print("\n[RESULT] 逆生成に失敗しました。入力されたSeed TypeとPlant Typeを確認してください。")