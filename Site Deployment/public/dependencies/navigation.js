function navigate(page)
{
    window.location = page + ".html";
}

function flipIcon(iconID)
{
    let element = document.getElementById(iconID);
    let transform = element.style.transform;
    let setScale = -1;

    if(transform.includes("-1")){
        setScale = 1;
    }

    element.style.transform = `scaleY(${setScale})`
}