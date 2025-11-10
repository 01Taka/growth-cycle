import os
import json
from typing import Dict, Any, List, Union

# 依存するコアロジックをインポート
# plant_creation_logic.py は、さらに module_config_utils.py に依存しています
from plant_creation_logic import create_new_plant

# --- グローバル定数定義 (パス) ---

# 新しいPlant Typeの設定が格納されたJSONファイルのパス (CWDからの相対パス)
PYTHON_DATA_PATH = 'python/plants/new_plants.json' 
# 画像アセットが格納されているディレクトリのベースパス (CWDからの相対パス)
IMAGE_BASE_DIR = 'python/plants/images'

# --- データ構造の定義 (ローダーが読み込むJSON形式 - 新しい構造) ---

# JSONファイル内のモジュールアイテムデータ構造
LoaderModuleItem = Dict[str, Union[str, int]] # 'moduleType', 'moduleRarity', 'weight', 'zIndex', 'image_filename' を含む

# 新しい構造: modulesキーの値が { partType: [LoaderModuleItem, ...] }
LoaderModuleMap = Dict[str, List[LoaderModuleItem]]

# JSONファイル全体のデータ構造
PlantLoaderData = Dict[str, Union[str, int, LoaderModuleMap]] # <--- 変更点: List[LoaderModuleData] -> LoaderModuleMap

# --- メインロジック関数 ---

def load_and_create_plant() -> None:
    """
    指定されたJSONファイルからPlant設定を読み込み、
    画像ファイルをバイト列に変換し、create_new_plantを実行する。
    """
    print(f"--- [START] Plant Data Loading Process ---")

    try:
        # 1. 設定JSONファイルの読み込み
        with open(PYTHON_DATA_PATH, 'r', encoding='utf-8') as f:
            plant_loader_data: PlantLoaderData = json.load(f)
        print(f"[ACTION] Successfully loaded JSON from: {PYTHON_DATA_PATH}")

    except FileNotFoundError:
        print(f"[FATAL ERROR] JSON file not found: {PYTHON_DATA_PATH}")
        print("Please ensure the file exists in the specified relative path.")
        return
    except json.JSONDecodeError:
        print(f"[FATAL ERROR] Failed to decode JSON from: {PYTHON_DATA_PATH}")
        print("Please check the JSON file format for errors.")
        return
    except Exception as e:
        print(f"[FATAL ERROR] An unexpected error occurred during JSON loading: {e}")
        return

    # 2. PlantOptionのフラットな引数を抽出
    try:
        raw_seed_type = plant_loader_data['seed_type']
        if not isinstance(raw_seed_type, (str, int)):
             raise TypeError("'seed_type' must be a string or integer.")
        seed_type = str(raw_seed_type)

        raw_plant_type = plant_loader_data['plant_type']
        if not isinstance(raw_plant_type, (str, int)):
             raise TypeError("'plant_type' must be a string or integer.")
        plant_type = str(raw_plant_type)

        raw_min_size = plant_loader_data['min_size']
        if not isinstance(raw_min_size, int):
             raise TypeError("'min_size' must be an integer.")
        min_size = int(raw_min_size)

        raw_max_size = plant_loader_data['max_size']
        if not isinstance(raw_max_size, int):
             raise TypeError("'max_size' must be an integer.")
        max_size = int(raw_max_size)

        raw_rarity = plant_loader_data['rarity']
        if not isinstance(raw_rarity, (str, int)):
             raise TypeError("'rarity' must be a string or integer.")
        rarity = str(raw_rarity)

        raw_weight = plant_loader_data['weight']
        if not isinstance(raw_weight, int):
             raise TypeError("'weight' must be an integer.")
        weight = int(raw_weight)

        # modules_rawは辞書であることを確認
        modules_raw = plant_loader_data['modules']
        if not isinstance(modules_raw, dict): # <--- 変更点: リストではなく辞書をチェック
            raise TypeError("'modules' must be a dictionary (map).")
            
    except (KeyError, TypeError, ValueError) as e:
        print(f"[FATAL ERROR] JSON structure is invalid or missing required keys: {e}")
        return

    # 3. モジュールデータの変換と画像ファイルの読み込み
    module_data_list: List[Dict[str, Any]] = []

    # PartTypeごとにループ (キーがPartType)
    for part_type, module_items in modules_raw.items(): # <--- 変更点: 辞書を反復処理
        if not isinstance(module_items, list):
             print(f"[FATAL ERROR] Module value for part '{part_type}' is not a list. Skipping.")
             continue # このPartTypeはスキップ

        # 各モジュールアイテムについてループ
        for module_item in module_items:
            # module_itemがDictであることを確認
            if not isinstance(module_item, dict):
                 print(f"[FATAL ERROR] Module item is not a dictionary in part '{part_type}': {module_item}. Skipping.")
                 continue # このモジュールアイテムはスキップ

            # モジュールアイテムをコピー
            module_copy: Dict[str, Union[str, int, bytes]] = dict(module_item)
            
            # create_new_plantが期待する 'partType' キーを、外側の辞書のキーから取得して追加
            module_copy['partType'] = part_type # <--- 重要な変更点

            # 'image_filename' キーを使って画像ファイルを読み込む
            image_filename_raw = module_copy.pop('image_filename', None)
            if not isinstance(image_filename_raw, (str, int)):
                print(f"[FATAL ERROR] 'image_filename' is missing or not a string/int in module: {module_copy}. Skipping.")
                return
                
            image_filename = str(image_filename_raw)
            image_full_path = os.path.join(IMAGE_BASE_DIR, image_filename)

            try:
                with open(image_full_path, 'rb') as f:
                    image_data_bytes = f.read()
                print(f"[ACTION] Successfully read image: {image_full_path}")
                
                # create_new_plantが期待する 'image' キーにバイト列を格納
                module_copy['image'] = image_data_bytes
                
                # ModuleCreationData (バイト列を含むDict) をリストに追加
                module_data_list.append(module_copy)

            except FileNotFoundError:
                print(f"[FATAL ERROR] Image file not found: {image_full_path}")
                print("Skipping this module.")
                return # 1つでも画像がなければ処理を中断する
                
    # モジュールデータがない場合は処理を中断
    if not module_data_list:
        print("[FATAL ERROR] No valid module data was processed after image checks.")
        return

    # 4. create_new_plantの呼び出し
    try:
        create_new_plant(
            seed_type=seed_type,
            new_plant_type=plant_type,
            min_size=min_size,
            max_size=max_size,
            rarity=rarity,
            weight=weight,
            module_data_list=module_data_list
        )
        print(f"--- [END] Plant data processing finished successfully. ---")
    
    except ValueError as e:
        print(f"\n[FATAL ERROR] Integrity Check Failed: {e}")
        print("The plant or module key already exists in the configuration files.")
    except IOError as e:
        print(f"\n[FATAL ERROR] File I/O Failed during creation: {e}")
        print("Check permissions or file system integrity.")
    except Exception as e:
        print(f"\n[FATAL ERROR] An unexpected error occurred during plant creation: {e}")


if __name__ == '__main__':
    # 実行
    # NOTE: このスクリプトを実行する前に、以下のファイル/ディレクトリが
    # CWD (カレントワーキングディレクトリ) からの相対パスで存在する必要があります:
    # 1. python/plants/new_plants.json (設定ファイル)
    # 2. python/plants/images/ (画像ファイルディレクトリ)
    # 3. data/ (modules_config.json, plants_config.json, seeds_config.json の格納先)
    print("--- Starting Plant Data Loader ---")
    
    # 実行テストのために必要なダミーのJSONとディレクトリを作成するテスト関数を定義
    def setup_dummy_files_for_test():
        os.makedirs('python/plants/images', exist_ok=True)
        os.makedirs('data', exist_ok=True)
        
        # ダミー画像ファイルを作成
        dummy_image_data = b'DUMMY_PNG_DATA' # 実際のPNGデータである必要はない
        with open('python/plants/images/tulipB_stem_v1.png', 'wb') as f:
            f.write(dummy_image_data)
        with open('python/plants/images/tulipB_flower_sr.png', 'wb') as f:
            f.write(dummy_image_data)
        
        # 設定JSONファイルを作成 (新しい構造を反映)
        dummy_json_data: PlantLoaderData = {
            "seed_type": "Science",
            "plant_type": "TulipB",
            "min_size": 150,
            "max_size": 200,
            "rarity": "SR",
            "weight": 75,
            # <--- 新しい modules 構造
            "modules": {
                "Stem": [
                    {
                        "moduleType": "Stem_V1",
                        "moduleRarity": "R",
                        "weight": 100,
                        "zIndex": 10,
                        "image_filename": "tulipB_stem_v1.png"
                    }
                ],
                "Flower": [
                    {
                        "moduleType": "Flower_SR",
                        "moduleRarity": "SR",
                        "weight": 50,
                        "zIndex": 20,
                        "image_filename": "tulipB_flower_sr.png"
                    }
                ]
            }
            # --->
        }
        with open(PYTHON_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(dummy_json_data, f, indent=4)
        
        # 依存ファイルが存在しないとエラーになるため、空の依存ファイルを作成
        for config_path in ['data/modules_config.json', 'data/plants_config.json', 'data/seeds_config.json']:
            if not os.path.exists(config_path):
                with open(config_path, 'w', encoding='utf-8') as f:
                    json.dump({}, f)

    setup_dummy_files_for_test()
    load_and_create_plant()
    print("--- Plant Data Loader Test Finished ---")