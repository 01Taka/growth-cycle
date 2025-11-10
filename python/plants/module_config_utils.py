import os
import json
from typing import Dict, Any

# --- グローバル定数定義 ---

# モジュール設定ファイル（JSON）のパスをシミュレーション
# 実際の実行環境に合わせてこのパスを修正する必要があります
MODULES_CONFIG_JSON_PATH = 'src/json/plantsConfig/modules_config.json'

# パス構成のディレクトリキー (get_module_image_directory_pathで使用)
ROOT_DIR_KEY = 'src/assets/images/plantModules'
SEEDS_DIR_KEY = 'seeds'
PLANTS_DIR_KEY = 'plants'
PARTS_DIR_KEY = 'parts'
MODULES_DIR_KEY = 'modules'

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
    image_data: bytes # 画像データをバイト列(bytes)として想定
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
        
    Raises:
        ValueError: モジュールキーが既存の設定に重複している場合
        IOError: ファイル操作中にエラーが発生した場合
    """
    try:
        # 構造要素を個別に渡す
        module_key = get_module_key(seed_type, plant_type, part_type, module_type)
        directory_path = get_module_image_directory_path(seed_type, plant_type, part_type, module_type)
        
        image_file_name = f"{module_type.lower()}.png"
        image_file_path = os.path.join(directory_path, image_file_name)

        print(f"--- [START] Creating New Module: {module_key} ---")
        print(f"Target Directory: {directory_path}")

        # 1. ディレクトリの作成 (実際の操作)
        # 既に存在する場合は何もしない (exist_ok=True)
        os.makedirs(directory_path, exist_ok=True)
        print(f"[ACTION] Directory created/checked: {directory_path}")
        
        # 2. 画像ファイルの保存 (実際の操作: バイナリ書き込み)
        with open(image_file_path, 'wb') as f:
            f.write(image_data)
        print(f"[ACTION] Image saved to: {image_file_path}")

        # 3. JSON設定の読み込み (実際の操作)
        modules_config: Dict[str, ModuleSetting] = {}
        try:
            with open(MODULES_CONFIG_JSON_PATH, 'r', encoding='utf-8') as f:
                modules_config = json.load(f)
            print(f"[ACTION] Loaded existing config from: {MODULES_CONFIG_JSON_PATH}")
        except FileNotFoundError:
            # ファイルが存在しない場合は空の辞書から開始
            print("[INFO] Config file not found. Starting with empty config.")
        except json.JSONDecodeError:
            # JSON形式が不正な場合は警告を出し、空の辞書から開始
            print("[WARNING] Error decoding existing JSON. Overwriting config with new data.")
            # 既存のデータは破損しているとみなし、空の辞書で上書きする

        # 4. 整合性チェック: モジュールキーの重複を確認
        if module_key in modules_config:
            # 重複は重大なエラーとしてスロー
            raise ValueError(f"Module key already exists (Integrity Check Failed): {module_key}")

        # 5. JSONに新しい設定を追加
        new_setting: ModuleSetting = {
            'imgPath': image_file_path,
            'zIndex': z_index
        }
        modules_config[module_key] = new_setting
        
        # 6. JSONを保存 (実際の操作: 読みやすいようにインデントと日本語対応)
        with open(MODULES_CONFIG_JSON_PATH, 'w', encoding='utf-8') as f:
            # ensure_ascii=False で日本語などをそのまま保存
            json.dump(modules_config, f, indent=4, ensure_ascii=False)
        
        print("[INFO] Updated config data (partial view):")
        print(json.dumps({module_key: new_setting}, indent=4, ensure_ascii=False))
        print(f"[ACTION] Config saved back to: {MODULES_CONFIG_JSON_PATH}")
        print(f"--- [SUCCESS] Module {module_key} configuration completed. ---")

    except Exception as e:
        # すべてのファイルI/Oエラーやその他の予期せぬエラーを捕捉し、より具体的なIOErrorで再スロー
        print(f"[FATAL ERROR] Operation failed: {e}")
        # ValueErrorは重複チェックでスローされるため、それ以外はIOErrorとして扱う
        if not isinstance(e, ValueError):
            raise IOError(f"File operation failed for {module_key}: {e}") from e
        raise # ValueErrorを再スロー