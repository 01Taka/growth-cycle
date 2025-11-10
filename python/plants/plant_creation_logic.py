import os
import json
from typing import Dict, Any, Union, List
from module_config_utils import create_new_module

# --- グローバル定数定義 ---

# Plantの設定を保存するJSONファイルパス
PLANTS_CONFIG_JSON_PATH = 'src/json/plantsConfig/plants_config.json'
# Seedの設定を更新するJSONファイルパス
SEEDS_CONFIG_JSON_PATH = 'src/json/plantsConfig/seeds_config.json'

# --- データ構造の定義 ---
PlantOption = Dict[str, Union[str, int]]
PlantSetting = Dict[str, Union[str, Dict[str, Any]]]

# --- ヘルパー関数定義 ---
def get_plant_key(seed_type: str, plant_type: str) -> str:
    """PlantSettingを参照するためのキーを生成する。"""
    keys = [seed_type, plant_type]
    return '_'.join(key.upper() for key in keys)

def load_config(path: str) -> Dict[str, Any]:
    """JSON設定ファイルを読み込むヘルパー関数 (ファイルが存在しない場合は空の辞書を返す)"""
    try:
        # パスが存在しない場合も考慮し、ディレクトリを作成（必須ではないが安全のため）
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_config(path: str, data: Dict[str, Any]):
    """JSON設定ファイルを保存するヘルパー関数"""
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        raise IOError(f"Failed to save config file {path}: {e}")

# --- メインロジック関数 ---

def create_new_plant(
    seed_type: str,
    new_plant_type: str,
    min_size: int,         
    max_size: int,         
    rarity: str,           
    weight: int,           
    module_data_list: List[Dict[str, Any]],
    allow_overwrite: bool = False # 上書きを許可するかどうかのフラグ
) -> None:
    """
    新しいPlant Typeのデータと、その構成モジュール群を一括で設定カタログに追加または上書きする。
    """
    plant_key = get_plant_key(seed_type, new_plant_type)
    print(f"\n--- [START] Creating/Updating New Plant: {plant_key} (Overwrite: {allow_overwrite}) ---")

    # PlantOptionを再構築 (SEEDS_CONFIG用)
    plant_option_data: PlantOption = {
        'minSize': min_size,
        'maxSize': max_size,
        'rarity': rarity,
        'weight': weight,
    }

    try:
        # --- 1. 各モジュールアセットの保存とMODULE_SETTINGSの更新 ---
        for module_data in module_data_list:
            image_bytes = module_data.get('image', b'')
            
            # create_new_module の呼び出しに allow_overwrite を渡す
            create_new_module(
                seed_type=seed_type,
                plant_type=new_plant_type,
                part_type=module_data['partType'],
                module_type=module_data['moduleType'],
                z_index=module_data['zIndex'],
                image_data=image_bytes,
                allow_overwrite=allow_overwrite 
            )
        
        # --- 2. PLANT_SETTINGSに追加するデータ構造の構築 (PLANTS_CONFIG用) ---
        plant_modules_structure: Dict[str, Dict[str, Dict[str, Union[str, int]]]] = {}
        for item in module_data_list:
            part_type = item['partType']
            module_type = item['moduleType']

            if part_type not in plant_modules_structure:
                plant_modules_structure[part_type] = {}
            
            # ModuleOptionの構造に合わせてデータを格納
            plant_modules_structure[part_type][module_type] = {
                'moduleRarity': item['moduleRarity'],
                'weight': item['weight'],
            }

        new_plant_setting: PlantSetting = {
            'modules': plant_modules_structure
        }

        # --- 3. PLANTS_CONFIG.JSON の更新 ---
        plants_config: Dict[str, PlantSetting] = load_config(PLANTS_CONFIG_JSON_PATH)

        # 重複チェックと上書き処理
        if plant_key in plants_config:
            if not allow_overwrite:
                raise ValueError(f"Plant key already exists: {plant_key}. Aborting.")
            print(f"[INFO] {PLANTS_CONFIG_JSON_PATH} key '{plant_key}' will be overwritten.")

        # データを追加/上書きして保存
        plants_config[plant_key] = new_plant_setting
        save_config(PLANTS_CONFIG_JSON_PATH, plants_config)
        print(f"[ACTION] {PLANTS_CONFIG_JSON_PATH} updated/overwritten with key: {plant_key}")

        # --- 4. SEEDS_CONFIG.JSON の更新 ---
        seeds_config: Dict[str, Any] = load_config(SEEDS_CONFIG_JSON_PATH)
        
        seed_type_lower = seed_type.lower()
        if seed_type_lower not in seeds_config:
            seeds_config[seed_type_lower] = {'plants': {}}
            print(f"[INFO] New seedType '{seed_type_lower}' created in SEEDS_CONFIG.")

        new_plant_type_key = new_plant_type 
        
        # SEEDS_CONFIG内のPlantOptionの上書きチェック（上書き許可の場合にログ出力）
        if new_plant_type_key in seeds_config[seed_type_lower]['plants'] and allow_overwrite:
             print(f"[INFO] Seed plant option for '{new_plant_type_key}' will be overwritten in SEEDS_CONFIG.")
        
        # PlantOptionを追加/上書き
        seeds_config[seed_type_lower]['plants'][new_plant_type_key] = plant_option_data 

        # データを保存
        save_config(SEEDS_CONFIG_JSON_PATH, seeds_config)
        print(f"[ACTION] {SEEDS_CONFIG_JSON_PATH} updated/overwritten for seed: {seed_type_lower}")
        
        print(f"--- [SUCCESS] Plant {plant_key} registration completed. ---")

    except Exception as e:
        print(f"[FATAL ERROR] Plant creation failed for {plant_key}: {e}")
        if not isinstance(e, ValueError):
            raise IOError(f"File operation failed during plant creation: {e}") from e
        raise