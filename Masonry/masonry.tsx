import * as React from "react";
import { PropertyControls, ControlType } from "framer";

const style: React.CSSProperties = {
  width: "100%",
  display: "flex",
};

// Define type of property
interface Props {
  margin: number
  columns: number
  defaultColumn: boolean
  columnWidth: number
  background: string
}

interface State {
  columns: number
}

export class Masonry extends React.Component<Partial<Props>, State> {

    // Set default properties
    static defaultProps = {
      margin: 16,
      columns: 3,
      defaultColumn: true,
      columnWidth: 400,
      background: "#fff"
    }

    // Items shown in property panel
    static propertyControls: PropertyControls = {
      background: { type: ControlType.Color, title: "Background" },
      margin: { type: ControlType.Number, title: "Margin" },
      columns: { type: ControlType.Number, title: "Columns" },
      defaultColumn: { type: ControlType.Boolean, title: "Col Width", enabledTitle: "Default", disabledTitle: "Custom" },
      columnWidth: {
        type: ControlType.Number,
        title: "Value",
        hidden(props) {
          return props.defaultColumn == true
        }
      }
    }

    state: State = {
      columns: 3
    }

    columnHeights: Array<number> = []

    getLeft(columnWidth, column, width) {
      let diff = columnWidth - width
      if (this.props.defaultColumn) {
        return (columnWidth * column) + (this.props.margin * column) + this.props.margin
      } else {
        return columnWidth * column + diff/2 + this.props.margin/2
      }
    }

    getTop(column) {
      return this.columnHeights[column] + this.props.margin
    }

    getSmallest(array) {
      let smallestIndex = 0
      let smallest = array[smallestIndex];

      array.forEach((item, index) => {
        if (item < smallest) {
          smallestIndex = index
          smallest = item
        }
      })

      return {index: smallestIndex, smallest: smallest}
    }

    render() {

      let containerStyle = {
        ...style,
        background: this.props.background
      }

      if (!this.props.children[0]) {
        return (
          <div style={{
            ...containerStyle,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
          >
            Connect a frame –>
          </div>
        )
      }

      this.columnHeights = []
      for (let i = 0; i < this.props.columns; i++) {
        this.columnHeights.push(0)
      }

      // let columnWidth = (this.props.width - this.props.margin*2 - (this.props.columns-1)*this.props.margin) / this.props.columns
      let columnWidth = this.props.defaultColumn ? this.props.children[0].props.children[0].props.width : this.props.columnWidth

      let children = this.props.children[0].props.children

      children = React.Children.map(children, (child, index) => {
        let smallest = this.getSmallest(this.columnHeights)
        let columnIndex = smallest.index

        let newChild = React.cloneElement(child, {
          top: this.getTop(columnIndex),
          left: this.getLeft(columnWidth, columnIndex, child.props.width)
        })

        let height = newChild.props.height
        this.columnHeights[columnIndex] += height + this.props.margin

        return newChild
      })

      return (
        <div style={containerStyle}>
          {children}
        </div>
      )
    }
}
