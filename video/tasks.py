import subprocess


def convert720p(source_path):
    new_file_name = convert_path(source_path, "720p")
    cmd = (
        'ffmpeg -i "{}" -s hd720 -c:v libx264 -crf 23 -c:a aac -strict -2 "{}"'.format(
            source_path, new_file_name
        )
    )
    subprocess.run(cmd)


def convert480p(source_path):
    new_file_name = convert_path(source_path, "480p")
    cmd = (
        'ffmpeg -i "{}" -s hd480 -c:v libx264 -crf 23 -c:a aac -strict -2 "{}"'.format(
            source_path, new_file_name
        )
    )
    subprocess.run(cmd)


def convert_path(source_path, resolution):
    dot_index = source_path.rfind(".")
    base_name = source_path[:dot_index]
    ext = source_path[dot_index:]
    return f"{base_name}_{resolution}{ext}"
