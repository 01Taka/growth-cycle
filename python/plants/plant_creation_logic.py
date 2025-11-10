import os
import json
from typing import Dict, Any,  Union

# module_config_utils.py から依存関数をインポート
# get_module_key, get_module_image_directory_path は不要。create_new_module の内部で処理される
from module_config_utils import create_new_module

# --- グローバル定数定義 ---

# Plantの設定を保存するJSONファイルパス
PLANTS_CONFIG_JSON_PATH = 'src/json/plantsConfig/plants_config.json'
# Seedの設定を更新するJSONファイルパス
SEEDS_CONFIG_JSON_PATH = 'src/json/plantsConfig/seeds_config.json'

# -------------------------

# --- データ構造の定義 (TypeScriptのInterfaceに対応) ---

# ModuleOptionに対応する辞書の型エイリアス (PlantSettingのmodulesに格納される抽選情報)
ModuleOption = Dict[str, Union[str, int]] # 'moduleRarity': str, 'weight': int

# PlantOptionに対応する辞書の型エイリアス (SeedSettingのplantsに格納される情報)
PlantOption = Dict[str, Union[str, int]] # 'minSize', 'maxSize', 'rarity', 'weight'を含む

# PlantSettingに対応する辞書の型エイリアス (PLANTS_CONFIGに格納されるデータ)
PlantSetting = Dict[str, Union[str, Dict[str, Any]]] # 'rarity': str, 'modules': Dict[str, Dict[str, ModuleOption]]

# --- ヘルパー関数定義 ---

def get_plant_key(seed_type: str, plant_type: str) -> str:
    """
    PlantSettingを参照するためのキーを生成する。
    """
    keys = [seed_type, plant_type]
    return '_'.join(key.upper() for key in keys)

# --- メインロジック関数 ---

def create_new_plant(
    seed_type: str,
    new_plant_type: str,
    min_size: int,        
    max_size: int,        
    rarity: str,          
    weight: int,          
    module_data_list
) -> None:
    """
    新しいPlant Typeのデータと、その構成モジュール群を一括で設定カタログに追加する。
    
    Args:
        seed_type: 親となるSeedのタイプ (例: 'Math')
        new_plant_type: 新しく作成する植物のタイプ (例: 'CactusB')
        min_size: 植物の最小サイズ
        max_size: 植物の最大サイズ
        rarity: 植物のレアリティ
        weight: 抽選に使われる重み
        module_data_list: この植物を構成する各モジュールの詳細リスト。
                          (partType, moduleType, moduleRarity, weight, zIndex, image) を含む。
                          
    Raises:
        ValueError: Plant Keyが既存の設定に重複している場合
        IOError: ファイル操作中にエラーが発生した場合
    """
    plant_key = get_plant_key(seed_type, new_plant_type)
    print(f"--- [START] Creating New Plant: {plant_key} ---")

    # フラットな引数からPlantOptionを再構築
    plant_data: PlantOption = {
        'minSize': min_size,
        'maxSize': max_size,
        'rarity': rarity,
        'weight': weight,
    }

    try:
        # --- 1. 各モジュールアセットの保存とMODULE_SETTINGSの更新 ---
        # create_new_moduleは内部でディレクトリ作成とJSON更新を行う
        for module_data in module_data_list:
            create_new_module(
                seed_type=seed_type,
                plant_type=new_plant_type,
                part_type=module_data['partType'],
                module_type=module_data['moduleType'],
                z_index=module_data['zIndex'],
                image_data=module_data['image'] # バイト列(bytes)を想定
            )
        
        # --- 2. PLANT_SETTINGSに追加するデータ構造の構築 ---
        plant_modules_structure: Dict[str, Dict[str, ModuleOption]] = {}
        for item in module_data_list:
            part_type = item['partType']
            module_type = item['moduleType']

            if part_type not in plant_modules_structure:
                plant_modules_structure[part_type] = {}
            
            # ModuleOptionの構造に合わせてデータを格納
            plant_modules_structure[part_type][module_type] = {
                # 'moduleRarity', 'weight' は ModuleCreationData から取得
                'moduleRarity': item['moduleRarity'],
                'weight': item['weight'],
            }

        new_plant_setting: PlantSetting = {
            'rarity': rarity,
            'modules': plant_modules_structure
        }

        # --- 3. PLANTS_CONFIG.JSON の更新 ---
        
        # 既存のデータを読み込み
        plants_config: Dict[str, PlantSetting] = {}
        try:
            with open(PLANTS_CONFIG_JSON_PATH, 'r', encoding='utf-8') as f:
                plants_config = json.load(f)
        except FileNotFoundError:
            print(f"[INFO] {PLANTS_CONFIG_JSON_PATH} not found. Starting empty.")
        except json.JSONDecodeError:
            print(f"[WARNING] Error decoding {PLANTS_CONFIG_JSON_PATH}. Starting empty.")

        # 重複チェック
        if plant_key in plants_config:
            raise ValueError(f"Plant key already exists (Integrity Check Failed): {plant_key}")

        # データを追加して保存
        plants_config[plant_key] = new_plant_setting
        with open(PLANTS_CONFIG_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(plants_config, f, indent=4, ensure_ascii=False)
        print(f"[ACTION] {PLANTS_CONFIG_JSON_PATH} updated with key: {plant_key}")

        # --- 4. SEEDS_CONFIG.JSON の更新 ---
        
        # 既存のデータを読み込み
        seeds_config: Dict[str, Any] = {}
        try:
            with open(SEEDS_CONFIG_JSON_PATH, 'r', encoding='utf-8') as f:
                seeds_config = json.load(f)
        except FileNotFoundError:
            print(f"[INFO] {SEEDS_CONFIG_JSON_PATH} not found. Starting empty.")
        except json.JSONDecodeError:
            print(f"[WARNING] Error decoding {SEEDS_CONFIG_JSON_PATH}. Starting empty.")
        
        # seedTypeが存在しない場合は作成
        seed_type_lower = seed_type.lower()
        if seed_type_lower not in seeds_config:
            seeds_config[seed_type_lower] = {'plants': {}}
            print(f"[INFO] New seedType '{seed_type_lower}' created in SEEDS_CONFIG.")

        # PlantOptionを追加
        new_plant_type_key = new_plant_type # Plant Type名をキーとして使用
        # 再構築した plant_data 辞書を使用
        seeds_config[seed_type_lower]['plants'][new_plant_type_key] = plant_data 

        # データを保存
        with open(SEEDS_CONFIG_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(seeds_config, f, indent=4, ensure_ascii=False)
        print(f"[ACTION] {SEEDS_CONFIG_JSON_PATH} updated for seed: {seed_type_lower}")
        
        print(f"--- [SUCCESS] Plant {plant_key} registration completed. ---")

    except Exception as e:
        print(f"[FATAL ERROR] Plant creation failed for {plant_key}: {e}")
        # ValueErrorは重複チェックでスローされるため、それ以外はIOErrorとして扱う
        if not isinstance(e, ValueError):
            raise IOError(f"File operation failed during plant creation: {e}") from e
        raise # ValueErrorを再スロー