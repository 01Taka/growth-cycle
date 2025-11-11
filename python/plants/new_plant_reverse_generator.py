import json
import os
import shutil
from typing import Dict, Any, List
from config import SEEDS_CONFIG_JSON_PATH, PLANTS_CONFIG_JSON_PATH, MODULES_CONFIG_JSON_PATH, IMAGE_BASE_DIR, CONFIG_FILE_PATH

# --- ヘルパー関数 ---

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
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # 実行時にエラーメッセージは出すが、呼び出し元で安全に処理できるように空の辞書を返す
        return {}

def write_json_output(data: Dict[str, Any], path: str):
    """結果のJSONデータを指定されたパスに書き込む"""
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        
        print(f"\n--- [SUCCESS] Output JSON written to: {path} ---")
    except Exception as e:
        print(f"\n[ERROR] Failed to write output file to {path}. Error: {e}")

# --- 画像処理関数 ---

def handle_image_directory_cleanup(base_dir: str):
    """画像ディレクトリのクリアをユーザーに確認し、実行する"""
    if os.path.exists(base_dir):
        print(f"\n[CLEANUP] 対象ディレクトリ: {base_dir}")
        response = input("このディレクトリをクリアしますか？ (y/N): ").lower()
        if response == 'y':
            try:
                # ディレクトリを削除し、再作成する
                shutil.rmtree(base_dir)
                os.makedirs(base_dir)
                print(f"[SUCCESS] ディレクトリ '{base_dir}' をクリアしました。")
            except Exception as e:
                print(f"[ERROR] ディレクトリのクリアに失敗しました: {e}")
        else:
            print("[INFO] ディレクトリのクリアをスキップしました。")
    else:
        # ディレクトリが存在しない場合は作成
        os.makedirs(base_dir, exist_ok=True)
        print(f"[INFO] ディレクトリ '{base_dir}' が存在しなかったため作成しました。")

def copy_module_images(modules_config: Dict[str, Any], dest_dir: str):
    """モジュール画像をアセットディレクトリから指定されたディレクトリにコピーする"""
    response = input("\n[COPY] コピー元の imgPath の画像をコピー先のディレクトリにコピーしますか？ (y/N): ").lower()
    
    if response == 'y':
        os.makedirs(dest_dir, exist_ok=True)
        copied_count = 0
        skipped_count = 0
        
        # Modules Configからすべての imgPath を抽出
        source_paths = [
            setting['imgPath'] 
            for setting in modules_config.values() 
            if 'imgPath' in setting
        ]

        print(f"\n[COPY START] {len(source_paths)} 個の画像を '{dest_dir}' にコピーします...")

        for src_path in source_paths:
            # 簡略化のため、imgPathは実行ディレクトリからの相対パスと仮定します
            source_file = src_path
            
            # ファイル名を取得
            filename = os.path.basename(source_file)
            destination_file = os.path.join(dest_dir, filename)

            if os.path.exists(source_file):
                try:
                    # ファイルのコピー (メタデータも保持する copy2 を使用)
                    shutil.copy2(source_file, destination_file)
                    copied_count += 1
                except Exception as e:
                    print(f"[ERROR] '{source_file}' のコピー中にエラーが発生しました: {e}")
            else:
                # ダミーとして作成したファイルが存在しない場合 (通常は発生しないはず)
                print(f"[WARNING] コピー元ファイルが見つかりませんでした: '{source_file}'")
                skipped_count += 1

        print(f"\n[COPY COMPLETE] 完了しました。コピー数: {copied_count}, スキップ数: {skipped_count}")
    else:
        print("[INFO] 画像のコピーをスキップしました。")

# --- メインロジック関数 (変更なし) ---

def reverse_engineer_new_plants_json(
    seed_type: str, 
    plant_type: str
):
    """
    seeds, plants, modulesの各設定ファイルから、
    new_plants.jsonの構造を逆生成します。
    """
    print(f"\n--- [START] Reverse Engineering for {seed_type.upper()}/{plant_type.upper()} ---")

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
    print(plant_modules_structure)

    # 4. モジュール情報を集約し、zIndexとimage_filenameを結合
    final_modules_map: Dict[str, List[Dict[str, Any]]] = {}
    
    for part_type, module_type_options in plant_modules_structure.items():
        final_modules_map[part_type] = []
        
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
        "min_size": plant_option_data.get('minSize', 0),
        "max_size": plant_option_data.get('maxSize', 0),
        "rarity": plant_option_data.get('rarity', ""),
        "weight": plant_option_data.get('weight', 0),
        "modules": final_modules_map
    }
    
    print("\n--- [SUCCESS] Reverse Engineering complete. ---")
    return result_data, modules_config


if __name__ == '__main__':
    print("\n-----------------------------------------------------")
    print("設定ファイルの逆生成を実行します。")
    print(f"JSON結果は '{CONFIG_FILE_PATH}' に出力されます。")
    print(f"画像コピー先は '{IMAGE_BASE_DIR}' です。")
    print("-----------------------------------------------------")
    
    # ユーザーに入力を求める
    seed_type_input = input("Seed Type (例: Art): ")
    plant_type_input = input("Plant Type (例: SakuraA): ")

    # 逆生成を実行 (modules_configも戻り値として受け取る)
    result_tuple = reverse_engineer_new_plants_json(
        seed_type=seed_type_input, 
        plant_type=plant_type_input
    )
    
    if result_tuple:
        result_data, modules_config = result_tuple
        
        # 1. JSONファイルをファイルに出力
        write_json_output(result_data, CONFIG_FILE_PATH)
        
        # 2. 画像ディレクトリのクリアを処理
        handle_image_directory_cleanup(IMAGE_BASE_DIR)

        # 3. 画像のコピーを処理
        copy_module_images(modules_config, IMAGE_BASE_DIR)
        
        # 4. コンソールにも最終JSONを表示（確認用）
        print("\n--- [CONSOLE PREVIEW] Generated JSON Content ---")
        print(json.dumps(result_data, indent=4, ensure_ascii=False))

    else:
        print("\n[RESULT] 逆生成に失敗しました。ファイル出力および画像処理はスキップされました。")