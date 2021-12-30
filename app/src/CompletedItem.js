function CompletedItem(props) {
    return (
        <div>
            <input type="checkbox" checked disabled />
            <label>{props.value}</label>
        </div>
    );
}

export default CompletedItem;