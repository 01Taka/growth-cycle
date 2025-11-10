import json
import os
import argparse
from typing import Dict, Any, List, Union

# --- グローバル定数 ---
# リセット対象のJSONファイルのパス
CONFIG_FILE_PATH = 'python/plants/new_plants.json'

def create_default_module_data(index: int) -> Dict[str, Union[str, int]]:
    """
    モジュールデータのひな形を生成し、デフォルト値を割り当てます。
    
    Args:
        index: モジュールリスト内のインデックス (識別子に使用)

    Returns:
        デフォルト値が設定されたモジュール辞書。（PartTypeは含まない）
    """
    return {
        "moduleType": f"Type_V{index + 1}",   # モジュールバリエーション
        "moduleRarity": "",                   # モジュールのレアリティ (例: R, SR)
        "weight": 0,                          # 抽選に使われる重み
        "zIndex": 0,                          # レンダリング時のZ-Index
        "image_filename": "",                 # 対応する画像ファイル名
    }

def reset_new_plants_json(part_count: int) -> None:
    """
    新しい植物の設定ファイル (new_plants.json) をデフォルト値でリセットします。
    modulesフィールドは { PartType: [ModuleItem, ...] } の構造になります。

    Args:
        part_count: 生成するパーツの数。
    """
    print(f"--- [START] Configuration Reset for {CONFIG_FILE_PATH} ---")

    # 1. Part_countの数だけ PartType とモジュールリストを生成
    modules_by_part: Dict[str, List[Dict[str, Union[str, int]]]] = {}
    
    for i in range(part_count):
        # PartType_1, PartType_2, ... といったキーを生成
        part_key = f"PartType_{i + 1}"
        
        # 各パーツにはデフォルトで1つのモジュールアイテムを持たせる
        # create_default_module_dataのインデックスはパーツループのインデックスを使用
        module_items: List[Dict[str, Union[str, int]]] = [create_default_module_data(i)]
        
        modules_by_part[part_key] = module_items
    
    # 3. Plant全体のひな形の定義
    default_data: Dict[str, Any] = {
        "seed_type": "",            # 親となるシードタイプ (例: Art, Science)
        "plant_type": "",           # 新しい植物のタイプ名 (例: SakuraA)
        "min_size": 0,              # 最小サイズ (整数)
        "max_size": 0,              # 最大サイズ (整数)
        "rarity": "",               # 植物のレアリティ (例: SR, SSR)
        "weight": 0,                # シード抽選時の重み
        "modules": modules_by_part  # PartTypeごとの辞書に
    }

    # 4. JSONファイルへの書き込み
    try:
        # パスが存在しない場合はディレクトリを作成
        os.makedirs(os.path.dirname(CONFIG_FILE_PATH), exist_ok=True)
        
        with open(CONFIG_FILE_PATH, 'w', encoding='utf-8') as f:
            # 日本語対応のため ensure_ascii=False を使用し、読みやすいようにインデントを設定
            json.dump(default_data, f, indent=4, ensure_ascii=False)
        
        print(f"[SUCCESS] {CONFIG_FILE_PATH} has been reset.")
        print(f"[INFO] Generated {part_count} part(s), each with 1 module.")
        
    except Exception as e:
        print(f"[FATAL ERROR] Failed to write file {CONFIG_FILE_PATH}: {e}")
        return

def main():
    """コマンドライン引数を処理し、リセット関数を実行します。"""
    parser = argparse.ArgumentParser(
        description="新しい植物設定ファイル (new_plants.json) をデフォルト値でリセットします。"
    )
    parser.add_argument(
        'part_count', # 引数名を part_count に変更
        type=int,
        nargs='?', # オプション引数として扱う
        default=2, # デフォルト値は2
        help="生成するパーツの数 (デフォルト: 2)"
    )
    
    args = parser.parse_args()
    
    if args.part_count < 0:
        print("[ERROR] パーツの数は0以上である必要があります。")
        return

    # モジュール数が0の場合も空のリストとしてリセットを実行
    reset_new_plants_json(args.part_count)

if __name__ == '__main__':
    # スクリプトを実行する代わりに、直接関数を呼び出すテストをシミュレーション
    # デフォルトのパーツ数2で実行する場合:
    print("--- [TEST RUN] Resetting config with 2 parts ---")
    reset_new_plants_json(part_count=2)
    
    # 別のパーツ数で実行する場合:
    print("\n--- [TEST RUN] Resetting config with 3 parts ---")
    reset_new_plants_json(part_count=3)
