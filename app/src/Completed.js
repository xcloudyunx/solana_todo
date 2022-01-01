import Item from "./Item";

function Completed(props) {
    return (
        <div id="completed" className="list">
            <h3>Completed</h3>
            {
              props.completedList.map((d, i) => (
                <Item
                  key={i}
                  value={d}
                  completed={true}
                />
              ))
            }
        </div>
    );
}

export default Completed;