//https://github.com/PaperStrike/Pjax/blob/main/README.zh-Hans.md
import Pjax from "https://cdn.jsdelivr.net/npm/@sliphua/pjax@2.4.0/+esm"



window.pjax = new Pjax({
    defaultTrigger: {
        exclude: 'a[data-no-pjax]',
    },
    selectors: [
        "title",
        "#cola-content"
    ],
    switches: {
        "#cola-content": async (oldEle, newEle) => {
            if (!document.startViewTransition) {
                // domOp 降级用法
                Pjax.switches.default(oldEle, newEle)
                return;
            }
            const transition = document.startViewTransition(() => {
                Pjax.switches.default(oldEle, newEle)
            })

        }
    }
});

document.addEventListener('alpine:init', () => {
    Alpine.store('sidebar', {
        init(){
            let mqList = window.matchMedia('(min-width: 1024px)');
            if(mqList.matches){
                this.show=true
            }
        },
        show: false,
        close(el){
            const sidebar=document.querySelector('.cola-sidebar')
            this.show=false
            setTimeout(()=>{
                sidebar.style.display='none'
            },200)
        },
        open(el){
            const sidebar=document.querySelector('.cola-sidebar')
            sidebar.style.display='block'
            setTimeout(()=>{
                this.show=true
            },200)
        },
        toggle() {
            this.show = !this.show
        },
        isOpen() {
            return this.show === true
        }
    })
})