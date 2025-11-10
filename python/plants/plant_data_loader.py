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

# --- データ構造の定義 (ローダーが読み込むJSON形式) ---

# JSONファイル内のモジュールアイテムデータ構造
LoaderModuleItem = Dict[str, Union[str, int]] 

# 新しい構造: modulesキーの値が { partType: [LoaderModuleItem, ...] }
LoaderModuleMap = Dict[str, List[LoaderModuleItem]]

# JSONファイル全体のデータ構造
PlantLoaderData = Dict[str, Union[str, int, LoaderModuleMap]]

# --- メインロジック関数 ---

def load_and_create_plant(allow_overwrite: bool = False) -> None:
    """
    指定されたJSONファイルからPlant設定を読み込み、
    画像ファイルをバイト列に変換し、create_new_plantを実行する。
    上書きフラグをcreate_new_plantに渡す。
    
    Args:
        allow_overwrite: 既存のデータを上書きすることを許可するかどうか。
    """
    plant_type = "UNKNOWN" # エラーログ用
    seed_type = "UNKNOWN" # エラーログ用
    print(f"--- [START] Plant Data Loading Process (Overwrite: {allow_overwrite}) ---")

    try:
        # 1. 設定JSONファイルの読み込み
        with open(PYTHON_DATA_PATH, 'r', encoding='utf-8') as f:
            plant_loader_data = json.load(f)
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
        raw_seed_type = plant_loader_data.get('seed_type')
        if not isinstance(raw_seed_type, (str, int)):
            raise TypeError("'seed_type' is missing or invalid.")
        seed_type = str(raw_seed_type)

        raw_plant_type = plant_loader_data.get('plant_type')
        if not isinstance(raw_plant_type, (str, int)):
            raise TypeError("'plant_type' is missing or invalid.")
        plant_type = str(raw_plant_type)

        min_size = int(plant_loader_data.get('min_size', 0))
        max_size = int(plant_loader_data.get('max_size', 0))
        rarity = str(plant_loader_data.get('rarity', ''))
        weight = int(plant_loader_data.get('weight', 0))

        if not (min_size and max_size and rarity and weight):
             raise ValueError("Required plant size, rarity, or weight parameter is missing or zero.")

        modules_raw = plant_loader_data.get('modules')
        if not isinstance(modules_raw, dict):
            raise TypeError("'modules' must be a dictionary (map).")
            
    except (KeyError, TypeError, ValueError) as e:
        print(f"[FATAL ERROR] JSON structure is invalid or missing required keys for {seed_type}_{plant_type}: {e}")
        return

    # 3. モジュールデータの変換と画像ファイルの読み込み
    module_data_list: List[Dict[str, Any]] = []

    for part_type, module_items in modules_raw.items():
        if not isinstance(module_items, list):
            print(f"[FATAL ERROR] Module value for part '{part_type}' is not a list. Skipping.")
            continue 

        for module_item in module_items:
            if not isinstance(module_item, dict):
                print(f"[FATAL ERROR] Module item is not a dictionary in part '{part_type}'. Skipping.")
                continue

            module_copy: Dict[str, Union[str, int, bytes]] = dict(module_item)
            module_copy['partType'] = part_type # PartTypeを外側の辞書のキーから取得
            
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
                
                module_copy['image'] = image_data_bytes
                module_data_list.append(module_copy)

            except FileNotFoundError:
                print(f"[FATAL ERROR] Image file not found: {image_full_path}")
                print("Aborting entire plant creation.")
                return # 1つでも画像がなければ処理を中断する
                
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
            module_data_list=module_data_list,
            allow_overwrite=allow_overwrite # プロンプトから取得したフラグを渡す
        )
        print(f"--- [END] Plant data processing finished successfully for {seed_type}_{plant_type}. ---")
    
    except ValueError as e:
        print(f"\n[FATAL ERROR] Integrity Check Failed: {e}")
        print("The plant or module key already exists. Please rerun and choose 'y' to force update.")
    except IOError as e:
        print(f"\n[FATAL ERROR] File I/O Failed during creation: {e}")
        print("Check permissions or file system integrity.")
    except Exception as e:
        print(f"\n[FATAL ERROR] An unexpected error occurred during plant creation: {e}")


if __name__ == '__main__':
    # ユーザーに上書きを許可するかどうかを尋ねる
    print("--------------------------------------------------")
    print("設定ファイルの重複が見つかった場合、既存のデータを上書きしますか？")
    user_input = input("上書きしますか？ (y/n, nがデフォルト): ").strip().lower()
    print("--------------------------------------------------")
    
    # 'y'または'yes'の場合のみTrueとする
    overwrite_flag = user_input in ('y', 'yes')
    if overwrite_flag:
        print("[INFO] 上書きモードが有効になりました。")

    print("--- Starting Plant Data Loader ---")
    
    # ロジック関数にフラグを渡す
    load_and_create_plant(allow_overwrite=overwrite_flag)
    
    print("--- Plant Data Loader Finished ---")