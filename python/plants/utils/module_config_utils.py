import os
import json
from typing import Dict, Any

from config import MODULES_CONFIG_JSON_PATH, ROOT_DIR_KEY, SEEDS_DIR_KEY, PLANTS_DIR_KEY, PARTS_DIR_KEY, MODULES_DIR_KEY


# -------------------------

# --- データ構造の定義 (型ヒント用) ---
# ModuleSettingに対応する辞書の型エイリアス
ModuleSetting = Dict[str, Any] # 'imgPath', 'zIndex'を含む

# --- ヘルパー関数定義 ---

def get_module_key(
    seed_type: str,
    plant_type: str,
    part_type: str,
    module_type: str
) -> str:
    """
    モジュールを一意に識別するためのグローバルキーを生成する。
    
    Args:
        seed_type: 種のタイプ
        plant_type: 植物のタイプ
        part_type: 部位のタイプ
        module_type: モジュールのタイプ
        
    Returns:
        連結された大文字のキー文字列 (例: 'MATH_ROSEA_STEM_THICK_V1')
    """
    keys = [seed_type, plant_type, part_type, module_type]
    # TypeScript版と同様にすべて大文字に変換して連結
    return '_'.join(key.upper() for key in keys)

def get_module_image_directory_path(
    seed_type: str,
    plant_type: str,
    part_type: str,
    module_type: str
) -> str:
    """
    モジュールのアセットを保存するディレクトリパスを生成する。
    
    Args:
        seed_type: 種のタイプ
        plant_type: 植物のタイプ
        part_type: 部位のタイプ
        module_type: モジュールのタイプ
        
    Returns:
        ディレクトリパス文字列 (例: 'images/seeds/math/plants/rosea/parts/stem/modules/thick_v1')
    """
    # グローバル定数として定義されたパスキーを使用
    directory_path_keys = [
        ROOT_DIR_KEY,
        SEEDS_DIR_KEY,
        seed_type.lower(),
        PLANTS_DIR_KEY,
        plant_type.lower(),
        PARTS_DIR_KEY,
        part_type.lower(),
        MODULES_DIR_KEY,
        module_type.lower(),
    ]
    # OSに依存しないパス区切り文字で結合
    return os.path.join(*directory_path_keys)

# --- メインロジック関数 ---

def create_new_module(
    seed_type: str,
    plant_type: str,
    part_type: str,
    module_type: str,
    z_index: int,
    image_data: bytes, # 画像データをバイト列(bytes)として想定
    allow_overwrite: bool # **追加: 上書きを許可するかどうかのフラグ**
) -> None:
    """
    新しいモジュールの画像アセット保存と設定カタログへの追加を行う（実際のファイル操作）。
    
    Args:
        seed_type: 種のタイプ
        plant_type: 植物のタイプ
        part_type: 部位のタイプ
        module_type: モジュールのタイプ
        z_index: レンダリング時のZ座標
        image_data: 保存する画像データ (バイト列)
        allow_overwrite: モジュールキーが既存の場合に上書きを許可するかどうか
        
    Raises:
        ValueError: モジュールキーが既存の設定に重複しており、上書きが許可されていない場合
        IOError: ファイル操作中にエラーが発生した場合
    """
    module_key = get_module_key(seed_type, plant_type, part_type, module_type)
    directory_path = get_module_image_directory_path(seed_type, plant_type, part_type, module_type)
    image_file_name = f"{module_type.lower()}.png"
    image_file_path = os.path.join(directory_path, image_file_name)

    print(f"\n--- [START] Creating New Module: {module_key} ---")
    
    try:
        # 1. JSON設定の読み込み
        modules_config: Dict[str, ModuleSetting] = {}
        try:
            with open(MODULES_CONFIG_JSON_PATH, 'r', encoding='utf-8') as f:
                modules_config = json.load(f)
        except FileNotFoundError:
            print("[INFO] Config file not found. Starting with empty config.")
        except json.JSONDecodeError:
            print("[WARNING] Error decoding existing JSON. Overwriting config with new data.")

        # 2. 整合性チェック: モジュールキーの重複を確認と上書き処理
        if module_key in modules_config:
            if allow_overwrite:
                print(f"[WARNING] Module key '{module_key}' already exists. Overwriting is ALLOWED.")
            else:
                # 上書きが許可されていない場合、エラーをスロー
                raise ValueError(
                    f"Module key already exists (Integrity Check Failed): {module_key}. "
                    "Use 'allow_overwrite=True' to force an update."
                )

        # 3. ディレクトリの作成
        os.makedirs(directory_path, exist_ok=True)
        print(f"[ACTION] Directory created/checked: {directory_path}")
        
        # 4. 画像ファイルの保存
        # 'wb' モードは、ファイルが存在すれば上書きされます
        with open(image_file_path, 'wb') as f:
            f.write(image_data)
        print(f"[ACTION] Image saved/overwritten to: {image_file_path}")

        # 5. JSONに新しい設定を追加/更新
        new_setting: ModuleSetting = {
            'imgPath': image_file_path,
            'zIndex': z_index
        }
        modules_config[module_key] = new_setting
        
        # 6. JSONを保存
        with open(MODULES_CONFIG_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(modules_config, f, indent=4, ensure_ascii=False)
        
        print("[INFO] Updated config data (partial view):")
        print(json.dumps({module_key: new_setting}, indent=4, ensure_ascii=False))
        print(f"[ACTION] Config saved back to: {MODULES_CONFIG_JSON_PATH}")
        print(f"--- [SUCCESS] Module {module_key} configuration completed. ---")

    except Exception as e:
        # ValueError以外（主にファイルI/Oエラー）を捕捉し、具体的なIOErrorで再スロー
        print(f"[FATAL ERROR] Operation failed: {e}")
        if not isinstance(e, ValueError):
            raise IOError(f"File operation failed for {module_key}: {e}") from e
        raise # ValueErrorを再スロー

# --- テスト実行エリア ---

def cleanup_test_files():
    """テスト用に作成されたファイルとディレクトリをクリーンアップします。"""
    if os.path.exists(MODULES_CONFIG_JSON_PATH):
        os.remove(MODULES_CONFIG_JSON_PATH)
    
    # テスト用のディレクトリパスを削除
    test_path = os.path.join(ROOT_DIR_KEY, SEEDS_DIR_KEY, 'test', PLANTS_DIR_KEY)
    if os.path.exists(test_path):
        # ROOT_DIR_KEYからtestディレクトリを削除するためにパスを調整
        top_level_test_dir = os.path.join(ROOT_DIR_KEY, SEEDS_DIR_KEY, 'test')
        if os.path.exists(top_level_test_dir):
            shutil.rmtree(top_level_test_dir)
            
    print("\n[CLEANUP] Test files and directories cleaned up.")

if __name__ == '__main__':
    import shutil # テスト用クリーンアップのために必要
    
    # クリーンアップから開始
    cleanup_test_files()

    # --- テストデータ ---
    TEST_SEED = "Test"
    TEST_PLANT = "TreeA"
    TEST_PART = "Stem"
    TEST_MODULE = "Basic"
    
    # ダミー画像データ (バイナリデータとして)
    DUMMY_IMAGE_DATA_V1 = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0cIDAT\x08\xd7c`\x00\x00\x00\x02\x00\x01\xe2!\xbc \x00\x00\x00\x00IEND\xaeB`\x82'
    DUMMY_IMAGE_DATA_V2 = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0cIDAT\x08\xd7c`\x00\x00\x00\x02\x00\x01\xe2!\xbc \x00\x00\x00\x00IEND\xaeB`\x82' * 2 # サイズを変更したと仮定

    # --- テストシナリオ 1: 初回作成 (成功) ---
    print("\n================== SCENARIO 1: First Creation (Success) ==================")
    try:
        create_new_module(
            seed_type=TEST_SEED,
            plant_type=TEST_PLANT,
            part_type=TEST_PART,
            module_type=TEST_MODULE,
            z_index=10,
            image_data=DUMMY_IMAGE_DATA_V1,
            allow_overwrite=False # 初回なのでFalseでも問題ない
        )
    except Exception as e:
        print(f"[TEST ERROR] SCENARIO 1 FAILED: {e}")

    # --- テストシナリオ 2: 重複キーの作成 (失敗: allow_overwrite=False) ---
    print("\n================== SCENARIO 2: Duplicate Attempt (Failure) ==================")
    try:
        create_new_module(
            seed_type=TEST_SEED,
            plant_type=TEST_PLANT,
            part_type=TEST_PART,
            module_type=TEST_MODULE,
            z_index=20, # zIndexを変更
            image_data=DUMMY_IMAGE_DATA_V2,
            allow_overwrite=False # 上書きを許可しない
        )
    except ValueError as e:
        print(f"[TEST SUCCESS] SCENARIO 2 CAUGHT EXPECTED ERROR: {e}")
    except Exception as e:
        print(f"[TEST ERROR] SCENARIO 2 FAILED UNEXPECTEDLY: {e}")

    # --- テストシナリオ 3: 重複キーの作成 (成功: allow_overwrite=True) ---
    print("\n================== SCENARIO 3: Overwrite Attempt (Success) ==================")
    try:
        create_new_module(
            seed_type=TEST_SEED,
            plant_type=TEST_PLANT,
            part_type=TEST_PART,
            module_type=TEST_MODULE,
            z_index=30, # zIndexをさらに変更
            image_data=DUMMY_IMAGE_DATA_V2,
            allow_overwrite=True # 上書きを許可
        )
    except Exception as e:
        print(f"[TEST ERROR] SCENARIO 3 FAILED: {e}")
        
    # --- 最終確認 ---
    print("\n================== FINAL CONFIG CHECK ==================")
    try:
        with open(MODULES_CONFIG_JSON_PATH, 'r', encoding='utf-8') as f:
            final_config = json.load(f)
            print(json.dumps(final_config, indent=4, ensure_ascii=False))
            
            final_module_key = get_module_key(TEST_SEED, TEST_PLANT, TEST_PART, TEST_MODULE)
            
            # 最終的な zIndex が 30 (上書きされた値) であることを確認
            if final_config.get(final_module_key, {}).get('zIndex') == 30:
                print("\n[TEST RESULT] Final zIndex is 30. Overwrite successful.")
            else:
                print("\n[TEST RESULT] Final zIndex is incorrect. Overwrite FAILED.")
    except Exception as e:
        print(f"[TEST ERROR] Final check failed: {e}")
        
    # 最終クリーンアップ（オプション）
    # cleanup_test_files()