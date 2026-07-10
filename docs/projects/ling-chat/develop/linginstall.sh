#!/bin/bash

set -e

echo "========================================"
echo "           LingChat Linux               "
echo "========================================"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        log_error "无法检测操作系统类型"
        exit 1
    fi
}

install_dependencies() {
    log_info "检测到系统: $OS $VER"
    log_info "安装系统依赖..."
    
    case $ID in
        ubuntu|debian)
            sudo apt update
            if ! dpkg -l | grep -q git; then
                sudo apt install -y git
            fi
            if ! dpkg -l | grep -q curl; then
                sudo apt install -y curl
            fi
            if ! dpkg -l | grep -q python3; then
                sudo apt install -y python3 python3-pip python3-venv
            fi
            ;;
        centos|rhel|fedora)
            if ! command -v git &> /dev/null; then
                if [ "$ID" = "fedora" ]; then
                    sudo dnf install -y git
                else
                    sudo yum install -y git
                fi
            fi
            if ! command -v curl &> /dev/null; then
                if [ "$ID" = "fedora" ]; then
                    sudo dnf install -y curl
                else
                    sudo yum install -y curl
                fi
            fi
            if ! command -v python3 &> /dev/null || ! command -v pip3 &> /dev/null; then
                if [ "$ID" = "fedora" ]; then
                    sudo dnf install -y python3 python3-pip
                else
                    sudo yum install -y python3 python3-pip
                fi
            fi
            ;;
        arch)
            if ! command -v git &> /dev/null; then
                sudo pacman -S --noconfirm git
            fi
            if ! command -v curl &> /dev/null; then
                sudo pacman -S --noconfirm curl
            fi
            if ! command -v python &> /dev/null; then
                sudo pacman -S --noconfirm python python-pip
            fi
            ;;
        *)
            log_warn "未知系统类型，请手动安装: git, curl, python3, python3-pip"
            ;;
    esac
}

install_git_lfs() {
    log_info "安装 Git LFS..."
    if ! command -v git-lfs &> /dev/null; then
        case $ID in
            ubuntu|debian)
                sudo apt install -y git-lfs
                ;;
            centos|rhel|fedora)
                if [ "$ID" = "fedora" ]; then
                    sudo dnf install -y git-lfs
                else
                    sudo yum install -y git-lfs
                fi
                ;;
            arch)
                sudo pacman -S --noconfirm git-lfs
                ;;
        esac
        git lfs install
    else
        log_info "Git LFS 已安装"
    fi
}
check_latency() {
    log_info "检测网络延迟..."
    github_latency=$(ping -c 1 github.com | grep 'time=' | sed 's/.*time=\([0-9.]*\) ms/\1/')
    gitee_latency=$(ping -c 1 gitee.com | grep 'time=' | sed 's/.*time=\([0-9.]*\) ms/\1/')
    if (( $(echo "$github_latency < $gitee_latency" | bc -l) )); then
        log_info "选择 GitHub 作为克隆源 (延迟: ${github_latency}ms)"
        clone_url="https://github.com/SlimeBoyOwO/LingChat.git"
    else
        log_info "选择 Gitee 作为克隆源 (延迟: ${gitee_latency}ms)"
        clone_url="https://gitee.com/and-me/LingChat.git"
    fi
}
clone_project() {
    log_info "克隆 LingChat 项目..."
    local project_dir="$(pwd)/LingChat"
    check_latency
    
    if [ -d "$project_dir" ]; then
        log_warn "项目目录已存在，尝试更新..."
        cd "$project_dir"
        git fetch origin
        git reset --hard origin/develop
    else
        git clone -b develop $clone_url
        cd "$project_dir"
    fi
}

setup_venv() {
    log_info "配置 Python 虚拟环境..."

    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    log_info "安装项目依赖..."
    pip install .
    
    if [ ! -f .env ]; then
        cp .env.example .env
        log_info "已创建 .env 文件，请根据需要编辑配置"
    fi
}

create_launch_script() {
    log_info "创建启动脚本..."
    cat > "$(pwd)/start_lingchat.sh" << 'EOF'
#!/bin/bash
cd "$(dirname -- "$0")"
source venv/bin/activate
python3 main.py
EOF

    chmod +x "$(pwd)/start_lingchat.sh"
    
    cat > "$(pwd)/update_lingchat.sh" << 'EOF'
#!/bin/bash
cd "$(dirname -- "$0")"
git fetch origin
git reset --hard origin/develop
source venv/bin/activate
pip install .
echo "更新完成！"
EOF

    chmod +x "$(pwd)/update_lingchat.sh"
}

# 主函数
main() {
    log_info "开始安装 LingChat..."
    detect_os
    install_dependencies
    install_git_lfs
    clone_project
    setup_venv
    create_launch_script
    
    log_info "========================================"
    log_info "安装完成！"
    log_info "========================================"
    log_info "启动方式:"
    log_info "  cd $(pwd)/LingChat"
    log_info "  source venv/bin/activate"
    log_info "  python3 main.py"
    log_info ""
    log_info "或使用快捷脚本:"
    log_info "  $(pwd)/start_lingchat.sh"
    log_info ""
    log_info "更新方式:"
    log_info "  $(pwd)/update_lingchat.sh 或使用lingchat内置的更新功能"
    log_info ""
    log_info "首次启动前请检查 $(pwd)/LingChat/.env 配置文件"
    log_info "========================================"
}

main "$@"
